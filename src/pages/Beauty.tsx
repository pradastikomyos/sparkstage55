import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const BeautyPage: React.FC = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Soft Aesthetic Hero */}
            <section className="bg-[#FAF7F5] py-24 md:py-32">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-8">
                        <Badge variant="secondary" className="bg-white text-main-500 border-main-200">Pure Radiance</Badge>
                        <h1 className="text-6xl md:text-8xl font-serif font-black text-gray-900 tracking-tighter uppercase leading-none">
                            Beauty in <br />
                            <span className="text-main-500">Motion</span>
                        </h1>
                        <p className="text-gray-500 text-lg uppercase tracking-widest font-bold max-w-sm leading-relaxed">
                            Discover our curated selection of high-performance skincare and makeup.
                        </p>
                        <div className="flex gap-4">
                            <Button className="h-14 px-10 rounded-none font-bold uppercase tracking-widest">
                                Shop Now
                            </Button>
                            <Button variant="ghost" className="h-14 px-6 font-bold uppercase tracking-widest text-gray-500">
                                View Tips <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <div className="aspect-square bg-white rounded-full p-8 shadow-2xl relative z-10 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=2080&auto=format&fit=crop" className="w-full h-full object-cover rounded-full" alt="Beauty" />
                        </div>
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-main-100/50 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-pink-100/50 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </section>

            {/* Product Highlight */}
            <section className="container mx-auto px-4 py-32">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <p className="text-main-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2">Bestsellers</p>
                        <h2 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tighter">Essential <span className="text-main-500">Glow</span></h2>
                    </div>
                    <Link to="/products?type=beauty" className="text-xs font-black uppercase tracking-[0.3em] border-b-2 border-main-500 pb-2 hover:text-main-500 transition-colors">
                        View Full Collection
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { name: 'Hydrating Serum', price: 'Rp 450.000', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1974&auto=format&fit=crop' },
                        { name: 'Radiant Blush', price: 'Rp 320.000', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2070&auto=format&fit=crop' },
                        { name: 'Velvet Lipstick', price: 'Rp 280.000', img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=2030&auto=format&fit=crop' }
                    ].map((p, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="aspect-[3/4] overflow-hidden mb-6 relative bg-gray-50 uppercase">
                                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <button className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center translate-y-20 group-hover:translate-y-0 transition-transform duration-500 hover:bg-main-500 hover:text-white">
                                    <ShoppingBag className="h-5 w-5" />
                                </button>
                            </div>
                            <h3 className="text-xl font-bold uppercase tracking-tight mb-1">{p.name}</h3>
                            <p className="text-main-500 font-black font-serif">{p.price}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default BeautyPage;
