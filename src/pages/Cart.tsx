import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Button from '@/components/ui/Button';

const Cart: React.FC = () => {
    const items = useCart((state) => state.items);
    const removeItem = useCart((state) => state.removeItem);
    const updateQuantity = useCart((state) => state.updateQuantity);
    const clearCart = useCart((state) => state.clearCart);
    const totalItems = useCart((state) => state.totalItems());
    const totalPrice = useCart((state) => state.totalPrice());

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
                <div className="bg-gray-50 p-10 rounded-full mb-8">
                    <ShoppingBag className="h-20 w-20 text-gray-300" />
                </div>
                <h2 className="text-4xl font-serif font-bold mb-4 tracking-tight uppercase">Your bag is empty</h2>
                <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                    Looks like you haven't added anything to your bag yet.
                    Explore our collection and find something unique.
                </p>
                <Link to="/products">
                    <Button size="lg" className="rounded-none px-12 h-14 font-bold uppercase tracking-widest">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <h1 className="text-5xl font-serif font-bold mb-12 tracking-tighter uppercase whitespace-pre-line">
                Your <span className="text-main-500 font-black">Shopping Bag</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="hidden md:grid grid-cols-6 gap-4 pb-4 border-b border-gray-900 uppercase text-[10px] font-black tracking-widest text-gray-400">
                        <div className="col-span-3">Product Detail</div>
                        <div className="text-center">Price</div>
                        <div className="text-center">Quantity</div>
                        <div className="text-right">Total</div>
                    </div>

                    {items.map((item) => (
                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center py-8 border-b border-gray-100 group">
                            {/* Product Info */}
                            <div className="col-span-1 md:col-span-3 flex items-center gap-6">
                                <div className="h-32 w-24 flex-shrink-0 bg-gray-50 overflow-hidden">
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-main-500">{item.type}</span>
                                    <h3 className="text-xl font-bold font-serif text-gray-900 uppercase leading-tight">{item.name}</h3>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {Object.entries(item.variantAttributes).map(([key, value]) => (
                                            <span key={key} className="text-xs bg-gray-100 px-2 py-1 uppercase font-bold tracking-tighter text-gray-600">
                                                {key}: {value}
                                            </span>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-xs font-black text-gray-400 hover:text-red-600 flex items-center gap-1 pt-4 uppercase tracking-[0.2em] transition-colors"
                                    >
                                        <Trash2 className="h-3 w-3" /> Remove
                                    </button>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="hidden md:block text-center font-bold text-gray-900">
                                Rp {item.price.toLocaleString('id-ID')}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex justify-center">
                                <div className="flex items-center border-2 border-gray-100">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="p-2 hover:bg-gray-100 transition-colors"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-10 text-center font-bold">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-2 hover:bg-gray-100 transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Item Total */}
                            <div className="text-right font-black text-lg font-serif">
                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                            </div>
                        </div>
                    ))}

                    <div className="pt-8 flex justify-between items-center">
                        <Button
                            variant="ghost"
                            onClick={clearCart}
                            className="text-gray-400 hover:text-red-600 font-bold uppercase tracking-[0.3em] text-[10px]"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Clear All Items
                        </Button>
                        <Link to="/products" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 hover:text-main-500 transition-colors flex items-center gap-2">
                            Continue Shopping <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                {/* Order Summary Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-8 md:p-10 sticky top-32">
                        <h3 className="text-2xl font-serif font-bold mb-8 uppercase tracking-widest border-b-2 border-gray-900 pb-4">Bag Summary</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm uppercase font-bold text-gray-500">
                                <span>Subtotal ({totalItems} items)</span>
                                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-sm uppercase font-bold text-gray-500">
                                <span>Shipping</span>
                                <span className="text-main-500">Calculated later</span>
                            </div>
                            <div className="pt-6 border-t border-gray-200 mt-6 flex justify-between items-end">
                                <span className="text-xs uppercase font-black tracking-widest text-gray-900">Total</span>
                                <span className="text-4xl font-serif font-black text-main-500">
                                    Rp {totalPrice.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>

                        <Link to="/checkout">
                            <Button className="w-full h-16 text-lg font-bold rounded-none uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all">
                                Checkout Now
                            </Button>
                        </Link>

                        <div className="mt-8 space-y-4">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center leading-relaxed font-bold">
                                Secure checkout with encrypted SSL and major payment providers
                            </p>
                            <div className="flex justify-center gap-4 opacity-30 grayscale">
                                {/* Mock payment icons */}
                                <div className="h-4 w-8 bg-gray-400 rounded-sm"></div>
                                <div className="h-4 w-8 bg-gray-400 rounded-sm"></div>
                                <div className="h-4 w-8 bg-gray-400 rounded-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
