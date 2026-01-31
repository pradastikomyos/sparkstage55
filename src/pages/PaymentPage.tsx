import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Lock, Ticket } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import Badge from '@/components/ui/Badge';
import { loadSnapScript } from '@/utils/midtransSnap';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { SessionErrorHandler } from '@/utils/sessionErrorHandler';
import { preserveBookingState, type BookingState } from '@/utils/bookingStateManager';

export default function PaymentPage() {
    const { id: reservationId } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'reservation'; // 'reservation' or 'order'

    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [snapLoaded, setSnapLoaded] = useState(false);

    // Reservation/Order Data
    const [data, setData] = useState<any>(null);

    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');

    useEffect(() => {
        // Priority: registered name from metadata > email prefix
        const nameFromMeta = (user?.user_metadata?.name as string | undefined) || '';
        const emailPrefix = user?.email ? (user.email.split('@')[0] || '') : '';
        setCustomerName(nameFromMeta || emailPrefix);
    }, [user]);

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
                // Products are stored in order_products (Spark studio backend)
                let tableName = type === 'reservation' ? 'reservations' : 'order_products';
                const select = type === 'reservation'
                    ? '*, ticket:tickets(*)'
                    : '*, order_product_items(*, product_variants(*))'

                const { data: record, error } = await supabase
                    .from(tableName)
                    .select(select)
                    .eq('id', reservationId)
                    .single();

                if (error) throw error;
                if (!record) throw new Error('Record not found');

                setData(record);
                if (record.customer_name) setCustomerName(record.customer_name);
                if (record.customer_phone) setCustomerPhone(record.customer_phone);

            } catch (err: any) {
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

        const errorHandler = new SessionErrorHandler({
            onSessionExpired: () => {
                navigate('/login');
            },
            preserveState: true
        });

        try {
            // SUPABASE BEST PRACTICE: Use getUser() to validate and auto-refresh JWT
            const bookingData: Omit<BookingState, 'timestamp'> = {
                ticketId: Number(data.ticket_id || 0),
                ticketName: String(data.ticket?.name || 'Photo Session'),
                ticketType: String(data.ticket?.type || 'entrance'),
                price: Number(data.ticket?.price || 0),
                date: String(data.booking_date || ''),
                time: String(data.time_slot || ''),
                quantity: Number(data.quantity || 1),
                total: Number(data.total_price || 0),
            };

            if (type === 'reservation') {
                preserveBookingState(bookingData);
            }

            const { data: { user: validatedUser }, error: userError } = await supabase.auth.getUser();
            if (userError || !validatedUser) {
                await errorHandler.handleAuthError({ status: 401 }, { returnPath: location.pathname, state: bookingData });
                setLoading(false);
                return;
            }

            const { data: { session: currentSession } } = await supabase.auth.getSession();
            if (!currentSession) {
                await errorHandler.handleAuthError({ status: 401 }, { returnPath: location.pathname, state: bookingData });
                setLoading(false);
                return;
            }

            const token = currentSession.access_token;

            // Call Edge Function (contract must match Spark studio)
            const slug = type === 'reservation' ? 'create-midtrans-token' : 'create-midtrans-product-token';
            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${slug}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(
                        type === 'reservation'
                            ? {
                                items: [
                                    {
                                        ticketId: Number(data.ticket_id),
                                        ticketName: String(data.ticket?.name || 'Photo Session'),
                                        price: Number(data.ticket?.price || 0),
                                        quantity: Number(data.quantity || 1),
                                        date: String(data.booking_date),
                                        timeSlot: String(data.time_slot),
                                    },
                                ],
                                customerName: customerName.trim(),
                                customerEmail: user.email,
                                customerPhone: customerPhone.trim() || undefined,
                            }
                            : {
                                items: Array.isArray(data.order_product_items)
                                    ? data.order_product_items.map((row: any) => ({
                                        productVariantId: Number(row.product_variant_id),
                                        name: String(row.product_variants?.name || `Variant ${row.product_variant_id}`),
                                        price: Number(row.price ?? row.product_variants?.price ?? 0),
                                        quantity: Number(row.quantity ?? 1),
                                    }))
                                    : [],
                                customerName: customerName.trim(),
                                customerEmail: user.email,
                                customerPhone: customerPhone.trim() || undefined,
                            }
                    ),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    await errorHandler.handleAuthError({ status: 401 }, { returnPath: location.pathname, state: type === 'reservation' ? bookingData : undefined });
                    return;
                }
                throw new Error(result.error || 'Failed to initialize payment');
            }

            // Open Snap
            if (window.snap) {
                window.snap.pay(result.token, {
                    onSuccess: (paymentResult: any) => {
                        console.log('Payment Success:', paymentResult);
                        // IMPORTANT: Do NOT mark paid client-side. Rely on midtrans-webhook + sync-midtrans-status.
                        const orderNumber = String(result.order_number || '');
                        if (orderNumber) {
                            navigate(`/booking-success?order_id=${encodeURIComponent(orderNumber)}`, { state: { data, paymentResult } });
                        } else {
                            navigate('/booking-success', { state: { data, paymentResult } });
                        }
                    },
                    onPending: (paymentResult: any) => {
                        console.log('Payment Pending:', paymentResult);
                        const orderNumber = String(result.order_number || '');
                        if (orderNumber) {
                            navigate(`/booking-success?order_id=${encodeURIComponent(orderNumber)}`, { state: { data, paymentResult, isPending: true } });
                        } else {
                            navigate('/booking-success', { state: { data, paymentResult, isPending: true } });
                        }
                    },
                    onError: (paymentResult: any) => {
                        console.error('Payment Error:', paymentResult);
                        setError('Payment failed. Please try again.');
                    },
                    onClose: () => {
                        setLoading(false);
                    }
                });
            }

        } catch (err: any) {
            console.error('Payment Error:', err);
            setError(err.message || 'An unexpected error occurred');
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
