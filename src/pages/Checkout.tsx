import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, ChevronRight, ShieldCheck, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart, type CartItem } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import { supabase } from '@/lib/supabase';
import type { TicketData } from '@/types';

interface TicketCheckoutState {
    ticket: TicketData;
    quantity: number;
    date: string;
    timeSlot: string;
    totalPrice: number;
}

interface ProductCheckoutState {
    items: Array<Omit<CartItem, 'id'>>;
}

const Checkout: React.FC = () => {
    const items = useCart((state) => state.items);
    const clearCart = useCart((state) => state.clearCart);
    const cartTotal = useCart((state) => state.totalPrice());
    const { user, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we have ticket state or product state passed via Buy Now
    const ticketState = location.state && 'ticket' in location.state ? (location.state as TicketCheckoutState) : null;
    const buyNowItems = location.state && 'items' in location.state ? (location.state as ProductCheckoutState).items : null;

    const checkoutItems: Array<CartItem | Omit<CartItem, 'id'>> = buyNowItems || items;

    // Mock Address
    const [address, setAddress] = useState({
        name: user?.name || '',
        phone: '',
        street: '',
        city: '',
        postalCode: ''
    });

    const totalPrice = ticketState
        ? ticketState.totalPrice
        : (buyNowItems ? buyNowItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) : cartTotal);

    const handlePlaceOrder = async () => {
        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }

        setIsLoading(true);

        try {
            if (ticketState) {
                // Handle Ticket Reservation
                const { ticket, quantity, date, timeSlot } = ticketState;
                const { data, error } = await supabase
                    .from('reservations')
                    .insert({
                        user_id: user.id,
                        ticket_id: ticket.id,
                        quantity: quantity,
                        booking_date: date,
                        time_slot: timeSlot,
                        total_price: totalPrice,
                        status: 'pending', // Pending payment
                        customer_name: address.name,
                        customer_email: user.email,
                        customer_phone: address.phone
                    })
                    .select()
                    .single();

                if (error) throw error;

                // Navigate to Payment Page
                navigate(`/payment/${data.id}?type=reservation`);
            } else {
                // Handle Product Order
                const orderNumber = `OR-${Date.now().toString().slice(-8).toUpperCase()}`;

                // 1. Create Order
                const { data: order, error: orderError } = await supabase
                    .from('order_products')
                    .insert({
                        user_id: user.id,
                        order_number: orderNumber,
                        total: totalPrice,
                        payment_status: 'pending',
                        status: 'waiting_payment',
                        customer_name: address.name,
                        customer_email: user.email,
                        customer_phone: address.phone
                    })
                    .select()
                    .single();

                if (orderError) throw orderError;

                // 2. Create Order Items
                const orderItems = checkoutItems.map(item => ({
                    order_product_id: order.id,
                    product_variant_id: item.variantId,
                    quantity: item.quantity,
                    price: item.price,
                    subtotal: item.price * item.quantity
                }));

                const { error: itemsError } = await supabase
                    .from('order_product_items')
                    .insert(orderItems);

                if (itemsError) throw itemsError;

                if (!buyNowItems) {
                    clearCart();
                }

                // Navigate to Payment Page
                navigate(`/payment/${order.id}?type=order`);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (items.length === 0 && !ticketState) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-4xl font-serif font-black mb-12 uppercase tracking-tighter">
                    Secure <span className="text-main-500">Checkout</span>
                </h1>

                {!isAuthenticated && (
                    <Alert variant="warning" title="Authentication Required" className="mb-8">
                        You need to be signed in to complete your purchase. <Link to="/login" className="font-bold underline">Sign in here</Link>
                    </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Shipping Address */}
                        <section className="bg-white p-8 border-t-4 border-gray-900 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-main-500 p-2 text-white">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-bold uppercase tracking-widest">
                                    {ticketState ? 'Billing Details' : 'Delivery Address'}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Full Name"
                                    defaultValue={address.name}
                                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                                />
                                <Input
                                    label="Phone Number"
                                    placeholder="+62..."
                                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                />
                                <div className="md:col-span-2">
                                    {ticketState ? (
                                        <div className="p-4 bg-gray-50 text-sm text-gray-500 italic">
                                            Ticket will be sent to your email: {user?.email}
                                        </div>
                                    ) : (
                                        <>
                                            <Input
                                                label="Street Address"
                                                placeholder="Apartment, suite, etc."
                                                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                            />
                                            <div className="grid grid-cols-2 gap-6 mt-6">
                                                <Input
                                                    label="City"
                                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                />
                                                <Input
                                                    label="Postal Code"
                                                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Order Review */}
                        <section className="bg-white p-8 border-t-4 border-gray-200 shadow-sm">
                            <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Review Items</h2>
                            <div className="divide-y divide-gray-100">
                                {ticketState ? (
                                    <div className="py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-main-100 p-4 rounded-lg">
                                                <LinkIcon className="h-8 w-8 text-main-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{ticketState.ticket.name} - {ticketState.date}</p>
                                                <p className="text-xs text-gray-500 uppercase tracking-widest">
                                                    Qty: {ticketState.quantity} | Slot: {ticketState.timeSlot || 'All Day'}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-bold">Rp {totalPrice.toLocaleString('id-ID')}</p>
                                    </div>
                                ) : (
                                    checkoutItems.map((item, idx) => (
                                        <div
                                            key={'id' in item ? item.id : `${item.productId}-${item.variantId ?? 0}-${idx}`}
                                            className="py-4 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-12 bg-gray-50 flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{item.name}</p>
                                                    <p className="text-xs text-gray-500 uppercase tracking-widest">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar: Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-black text-white p-10 space-y-8 sticky top-32">
                            <h3 className="text-2xl font-serif font-black uppercase tracking-[0.2em] border-b border-white/20 pb-6">Checkout Info</h3>

                            <div className="space-y-4">
                                <div className="flex justify-between text-xs uppercase tracking-widest text-white/60">
                                    <span>Subtotal</span>
                                    <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-xs uppercase tracking-widest text-white/60">
                                    <span>Tax</span>
                                    <span>Included</span>
                                </div>

                                <div className="pt-8 border-t border-white/10 mt-8 flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Payable Total</span>
                                    <span className="text-4xl font-serif font-black text-main-500">
                                        Rp {totalPrice.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>

                            <Button
                                onClick={handlePlaceOrder}
                                disabled={isLoading || !isAuthenticated}
                                className="w-full h-16 text-lg font-bold rounded-none uppercase tracking-[0.3em] overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isLoading ? 'Processing...' : 'Place Order'} <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Button>

                            <div className="space-y-6 pt-10 border-t border-white/5">
                                <div className="flex gap-4 items-start">
                                    <ShieldCheck className="h-6 w-6 text-main-500 shrink-0" />
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 leading-relaxed">
                                        Your transaction is protected by 256-bit SSL encryption.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
