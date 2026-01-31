import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import { CheckCircle, Clock, XCircle, ArrowLeft } from 'lucide-react';

interface LocationState {
    data?: any; // Order or Reservation data
    paymentResult?: any;
    isPending?: boolean;
}

export default function BookingSuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // State from navigation or fallback
    const state = location.state as LocationState;
    const orderNumber = searchParams.get('order_id');
    const orderId = state?.data?.id || searchParams.get('id');
    const type = state?.data?.type || searchParams.get('type') || 'reservation';

    const [status, setStatus] = useState<string>(state?.isPending ? 'pending' : 'active');
    const [ticketCode, setTicketCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId && !orderNumber) {
            setLoading(false);
            return;
        }

        const checkStatus = async () => {
            // Spark studio ticket payment flow uses orders table keyed by order_number
            const tableName = orderNumber ? 'orders' : (type === 'reservation' ? 'reservations' : 'order_products');

            try {
                const query = supabase.from(tableName as any).select('*');
                const { data, error } = orderNumber
                    ? await query.eq('order_number', orderNumber).single()
                    : await query.eq('id', orderId).single();

                if (error) throw error;

                if (data) {
                    setStatus(data.payment_status || data.status);

                    // Ticket purchase: load purchased ticket codes once order is paid
                    if (orderNumber && (data.status === 'paid' || data.status === 'active')) {
                        const { data: orderItems } = await supabase
                            .from('order_items')
                            .select('id')
                            .eq('order_id', data.id);

                        const orderItemIds = Array.isArray(orderItems) ? orderItems.map((r: any) => r.id) : [];
                        if (orderItemIds.length > 0) {
                            const { data: purchasedTickets } = await supabase
                                .from('purchased_tickets')
                                .select('ticket_code')
                                .in('order_item_id', orderItemIds)
                                .limit(1);

                            const firstCode = Array.isArray(purchasedTickets) ? purchasedTickets[0]?.ticket_code : null;
                            setTicketCode(firstCode || orderNumber);
                        } else {
                            setTicketCode(orderNumber);
                        }
                        return;
                    }

                    // Reservation / product pickup fallback
                    if (data.payment_status === 'paid' || data.status === 'paid' || data.status === 'active') {
                        setTicketCode(data.ticket_code || data.pickup_code || `RES-${data.id}`);
                    }
                }
            } catch (err) {
                console.error('Error checking status:', err);
            } finally {
                setLoading(false);
            }
        };

        checkStatus();

        let interval: ReturnType<typeof setInterval>;
        if (status === 'pending' || status === 'waiting_payment') {
            interval = setInterval(checkStatus, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [orderId, orderNumber, type, status]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main-500"></div>
            </div>
        );
    }

    const isPending = status === 'pending' || status === 'waiting_payment';
    const isPaid = status === 'paid' || status === 'active';

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="bg-white max-w-lg w-full p-8 shadow-xl border-t-8 border-main-500 relative overflow-hidden">
                <div className="text-center mb-8 relative z-10">
                    {isPending ? (
                        <div className="inline-flex p-4 rounded-full bg-yellow-100 text-yellow-600 mb-4 animate-pulse">
                            <Clock size={48} />
                        </div>
                    ) : isPaid ? (
                        <div className="inline-flex p-4 rounded-full bg-green-100 text-green-600 mb-4">
                            <CheckCircle size={48} />
                        </div>
                    ) : (
                        <div className="inline-flex p-4 rounded-full bg-red-100 text-red-600 mb-4">
                            <XCircle size={48} />
                        </div>
                    )}

                    <h1 className="text-3xl font-serif font-black uppercase tracking-widest text-gray-900 mb-2">
                        {isPending ? 'Processing' : isPaid ? 'Booking Confirmed' : 'Payment Failed'}
                    </h1>
                    <p className="text-gray-500">
                        {isPending ? 'We are verifying your payment. This may take a moment.' :
                            isPaid ? 'Thank you! Your order/ticket details have been updated.' :
                                'Something went wrong. Please try again or contact support.'}
                    </p>
                </div>

                {isPaid && (
                    <div className="bg-gray-50 p-8 border-2 border-dashed border-gray-300 mb-8 relative group">
                        <div className="text-center space-y-4">
                            <p className="text-xs uppercase font-bold tracking-[0.2em] text-gray-400">Your Booking/Pickup Code</p>
                            <div className="bg-white p-4 inline-block shadow-lg mx-auto">
                                <QRCode value={ticketCode || `RES-${orderId}`} size={200} />
                            </div>
                            <p className="font-mono text-sm font-bold text-gray-600 tracking-widest">{ticketCode || `RES-${orderId}`}</p>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <Button
                        onClick={() => navigate(type === 'reservation' ? '/my-tickets' : '/my-orders')}
                        variant="primary"
                        className="w-full h-14 font-bold uppercase tracking-widest"
                    >
                        {type === 'reservation' ? 'View My Tickets' : 'View My Orders'}
                    </Button>
                    <Button
                        onClick={() => navigate('/')}
                        variant="outline"
                        className="w-full h-14 font-bold uppercase tracking-widest border-gray-200 hover:bg-gray-50"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Return Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
