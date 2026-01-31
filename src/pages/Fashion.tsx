import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Play } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const FashionPage: React.FC = () => {
    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Split Hero */}
            <section className="flex flex-col lg:flex-row h-screen lg:h-[90vh]">
                <div className="w-full lg:w-1/2 bg-black flex flex-col justify-center px-8 md:px-20 py-20 relative overflow-hidden">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-main-500/20 blur-[120px]"></div>
                    <div className="relative z-10">
                        <Badge variant="primary" className="mb-6 uppercase tracking-[0.5em] font-black px-8">The Collection</Badge>
                        <h1 className="text-7xl md:text-9xl font-serif font-black text-white uppercase tracking-tighter leading-none mb-8">
                            STREET <br />
                            <span className="text-main-500">COUTURE</span>
                        </h1>
                        <p className="text-white/40 text-lg uppercase tracking-widest font-medium mb-12 max-w-sm">
                            Defining the next generation of urban luxury and high-performance fashion.
                        </p>
                        <Button className="h-16 px-12 rounded-none font-bold uppercase tracking-[0.3em] text-lg">
                            Explore Now <ArrowRight className="ml-4 h-6 w-6" />
                        </Button>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 relative bg-gray-100">
                    <img
                        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2040&auto=format&fit=crop"
                        alt="Fashion Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10"></div>
                    <button className="absolute bottom-10 left-10 w-24 h-24 bg-white rounded-full flex items-center justify-center group hover:bg-main-500 transition-colors">
                        <Play className="h-8 w-8 text-black fill-black group-hover:text-white group-hover:fill-white transition-colors ml-1" />
                    </button>
                    <div className="absolute top-10 right-10 flex flex-col items-center">
                        <div className="w-px h-24 bg-black/20 mb-4"></div>
                        <span className="[writing-mode:vertical-rl] text-[10px] font-black uppercase tracking-[0.5em]">Scroll to Discover</span>
                    </div>
                </div>
            </section>

            {/* Lookbook Grid */}
            <section className="container mx-auto px-4 py-32">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tighter mb-4">
                        Seasonal <span className="text-main-500">Lookbook</span>
                    </h2>
                    <p className="text-gray-400 uppercase tracking-[0.3em] text-sm font-bold">Volume 24 // Edition 01</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 md:row-span-2 aspect-[3/4] overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1539109132382-381bb3f1cff6?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Look 1" />
                    </div>
                    <div className="aspect-square overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Look 2" />
                    </div>
                    <div className="aspect-square overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Look 3" />
                    </div>
                    <div className="md:col-span-2 aspect-video overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1976&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Look 4" />
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="bg-gray-50 py-32 border-y border-gray-100">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <Sparkles className="h-12 w-12 text-main-500 mb-8" />
                        <h3 className="text-5xl font-serif font-black uppercase tracking-tighter mb-6 leading-tight">
                            Sustainability in Every <span className="text-main-500 underline underline-offset-8">Stitch</span>
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-lg">
                            We believe that luxury shouldn't cost the earth. Our latest collection features 100% recycled materials and ethical craftsmanship.
                        </p>
                        <Link to="/products?category=sustainable">
                            <Button variant="outline" className="h-14 px-10 border-gray-900 text-gray-900 rounded-none uppercase font-bold tracking-widest hover:bg-gray-900 hover:text-white transition-all">
                                Shop Sustainable
                            </Button>
                        </Link>
                    </div>
                    <div className="flex-1 w-full aspect-square bg-gray-200">
                        <img src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1972&auto=format&fit=crop" className="w-full h-full object-cover shadow-2xl skew-y-3" alt="Sustainable" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FashionPage;
