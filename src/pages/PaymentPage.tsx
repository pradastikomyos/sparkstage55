import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Lock, Ticket } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import Badge from '@/components/ui/Badge';
import { loadSnapScript } from '@/utils/midtransSnap';
import { formatCurrency, formatDate } from '@/utils/formatters';

type PaymentRecord = {
    id: string | number;
    total_price: number;
    quantity?: number | null;
    ticket_id?: number | string | null;
    status?: string | null;
    payment_status?: string | null;
    booking_date?: string | null;
    time_slot?: string | null;
    customer_name?: string | null;
    customer_phone?: string | null;
    ticket?: {
        name?: string | null;
        price?: number | null;
    } | null;
};

type SnapPaymentResult = {
    transaction_id?: string;
    payment_type?: string;
} & Record<string, unknown>;

export default function PaymentPage() {
    const { id: reservationId } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'reservation'; // 'reservation' or 'order'

    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [snapLoaded, setSnapLoaded] = useState(false);

    // Reservation/Order Data
    const [data, setData] = useState<PaymentRecord | null>(null);

    const [customerName, setCustomerName] = useState(user?.name || user?.email?.split('@')[0] || '');
    const [customerPhone, setCustomerPhone] = useState('');

    // Load Snap Script
    useEffect(() => {
        loadSnapScript()
            .then(() => setSnapLoaded(true))
            .catch((err) => {
                console.error('Failed to load Snap:', err);
                setError('Failed to load payment system. Refresh required.');
            });
    }, []);

    // Fetch Data if not in state
    useEffect(() => {
        const fetchData = async () => {
            if (!reservationId || !user) {
                setInitialLoading(false);
                return;
            }

            try {
                const tableName = type === 'reservation' ? 'reservations' : 'orders';
                const { data: record, error } = await supabase
                    .from(tableName)
                    .select('*, ticket:tickets(*)') // Join ticket for name/details
                    .eq('id', reservationId)
                    .single();

                if (error) throw error;
                if (!record) throw new Error('Record not found');

                setData(record as PaymentRecord);
                if (record.customer_name) setCustomerName(record.customer_name);
                if (record.customer_phone) setCustomerPhone(record.customer_phone);

            } catch (err) {
                console.error('Error fetching record:', err);
                setError('Could not find your booking/order details.');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchData();
    }, [reservationId, type, user]);

    const handleBack = () => {
        navigate(-1);
    };

    const handlePay = async () => {
        if (!user || !data || !snapLoaded) return;

        setLoading(true);
        setError(null);

        try {
            // Get Fresh Session
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Session expired. Please login again.');

            // Call Edge Function
            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-midtrans-token`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({
                        // Common payload structure expected by your generic Edge Function
                        transactionDetails: {
                            order_id: type === 'reservation' ? `RES-${data.id}-${Date.now()}` : `ORD-${data.id}-${Date.now()}`,
                            gross_amount: data.total_price,
                        },
                        customerDetails: {
                            first_name: customerName,
                            email: user.email,
                            phone: customerPhone,
                        },
                        itemDetails: [
                            {
                                id: type === 'reservation' ? data.ticket_id : 'ITEM',
                                price: data.ticket?.price || data.total_price, // Assuming 1 item type for now
                                quantity: data.quantity || 1,
                                name: data.ticket?.name || 'Order Item',
                            }
                        ],
                        // Metadata to link back to our DB record
                        metadata: {
                            type,
                            id: data.id,
                            user_id: user.id
                        }
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to initialize payment');
            }

            // Open Snap
            if (window.snap) {
                window.snap.pay(result.token, {
                    onSuccess: async (paymentResult: SnapPaymentResult) => {
                        console.log('Payment Success:', paymentResult);
                        // Update status in DB
                        await supabase
                            .from(type === 'reservation' ? 'reservations' : 'orders')
                            .update({
                                status: 'paid', // or 'confirmed'
                                payment_id: paymentResult.transaction_id,
                                payment_method: paymentResult.payment_type
                            })
                            .eq('id', data.id);

                        navigate('/booking-success', { state: { data, paymentResult } });
                    },
                    onPending: (paymentResult: SnapPaymentResult) => {
                        console.log('Payment Pending:', paymentResult);
                        navigate('/booking-success', { state: { data, paymentResult, isPending: true } });
                    },
                    onError: (paymentResult: SnapPaymentResult) => {
                        console.error('Payment Error:', paymentResult);
                        setError('Payment failed. Please try again.');
                    },
                    onClose: () => {
                        setLoading(false);
                    }
                });
            }

        } catch (err) {
            console.error('Payment Error:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main-500"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
                <ShieldCheck className="h-16 w-16 text-gray-300 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Record Not Found</h1>
                <p className="text-gray-500 mb-6">We couldn't find the reservation or order you are looking for.</p>
                <Button onClick={() => navigate('/')}>Return Home</Button>
            </div>
        );
    }

    const itemName = data.ticket?.name || 'Order Items';
    const subtext = data.booking_date
        ? `${formatDate(data.booking_date)} • ${data.time_slot || 'All Day'}`
        : 'Order processed';

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10">
                    <Button variant="ghost" className="pl-0 hover:bg-transparent text-gray-500 mb-4" onClick={handleBack}>
                        &larr; Back
                    </Button>
                    <h1 className="text-3xl font-serif font-black uppercase tracking-tighter">
                        Complete <span className="text-main-500">Payment</span>
                    </h1>
                </header>

                {error && (
                    <Alert variant="error" title="Payment Error" className="mb-8">{error}</Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Summary Card */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-none border border-gray-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <ShieldCheck size={120} />
                            </div>

                            <h2 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Ticket className="h-5 w-5 text-main-500" />
                                Order Summary
                            </h2>

                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-start pb-4 border-b border-dashed border-gray-200">
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-900">{itemName}</h3>
                                        <p className="text-sm text-main-600 font-medium">{subtext}</p>
                                    </div>
                                    <Badge variant="primary">x{data.quantity || 1}</Badge>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(data.total_price)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax & Fees</span>
                                        <span>Included</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                                    <span className="text-xs uppercase font-bold tracking-widest text-gray-400">Total Amount</span>
                                    <span className="text-3xl font-serif font-black text-main-500">
                                        {formatCurrency(data.total_price)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-400 p-4 bg-gray-100 rounded-lg">
                            <Lock className="h-4 w-4 shrink-0" />
                            <p>Transactions are secure and encrypted. We do not store your credit card details.</p>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-white p-8 border-t-4 border-main-500 shadow-sm h-fit">
                        <h3 className="text-xl font-bold mb-6">Customer Details</h3>
                        <div className="space-y-5">
                            <Input
                                label="Full Name"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Your Name"
                            />
                            <Input
                                label="Phone Number"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                placeholder="0812..."
                            />
                            <Input
                                label="Email Address"
                                value={user?.email || ''}
                                disabled
                                className="bg-gray-50"
                            />

                            <div className="pt-6">
                                <Button
                                    onClick={handlePay}
                                    disabled={loading || !snapLoaded || !customerName}
                                    className="w-full h-14 text-lg font-bold rounded-none uppercase tracking-widest"
                                >
                                    {loading ? 'Processing...' : `Pay ${formatCurrency(data.total_price)}`}
                                </Button>
                            </div>

                            <div className="flex justify-center gap-4 opacity-40 grayscale pt-4">
                                {/* Using text for icons to avoid external image deps for now */}
                                <span className="font-bold text-xs border p-1">VISA</span>
                                <span className="font-bold text-xs border p-1">Mastercard</span>
                                <span className="font-bold text-xs border p-1">QRIS</span>
                                <span className="font-bold text-xs border p-1">BCA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
