import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Ticket as TicketIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Home: React.FC = () => {
    // Mock Data
    const banners = [
        { id: 1, asset: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop', title: 'Summer Collection' },
        { id: 2, asset: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop', title: 'New Arrival' },
    ];

    const stageTickets = [
        { id: 1, name: 'Runway Prime', slug: 'runway-prime', image: 'https://images.unsplash.com/photo-1539109132314-34a933ee51c4?q=80&w=1974&auto=format&fit=crop' },
        { id: 2, name: 'Front Row', slug: 'front-row', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop' },
        { id: 3, name: 'Backstage Pass', slug: 'backstage-pass', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop' },
    ];

    const fashionProducts = [
        { id: 1, name: 'Minimalist Cotton Shirt', slug: 'minimalist-cotton-shirt', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1974&auto=format&fit=crop' },
        { id: 2, name: 'Structured Oversized Blazer', slug: 'structured-oversized-blazer', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2072&auto=format&fit=crop' },
        { id: 3, name: 'Linen Wide-Leg Trousers', slug: 'linen-wide-leg-trousers', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1974&auto=format&fit=crop' },
        { id: 4, name: 'Silk Midi Dress', slug: 'silk-midi-dress', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop' },
    ];

    const beautyProducts = [
        { id: 5, name: 'Hydrating Face Serum', slug: 'hydrating-face-serum', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1974&auto=format&fit=crop' },
        { id: 6, name: 'Organic Cleansing Balm', slug: 'organic-cleansing-balm', image: 'https://images.unsplash.com/photo-1556228578-8c7c0f44bb0b?q=80&w=1974&auto=format&fit=crop' },
        { id: 7, name: 'Revitalizing Night Cream', slug: 'revitalizing-night-cream', image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=1972&auto=format&fit=crop' },
        { id: 8, name: 'Lip Plumping Tint', slug: 'lip-plumping-tint', image: 'https://images.unsplash.com/photo-1512496011931-d1479075bc03?q=80&w=1974&auto=format&fit=crop' },
    ];

    return (
        <div className="bg-white">
            {/* Main Banners */}
            <section className="container mx-auto min-h-[70vh] relative lg:-top-8">
                <Swiper
                    modules={[Autoplay, Pagination]}
                    autoplay={{ delay: 10000 }}
                    pagination={{ clickable: true }}
                    className="h-[70vh]"
                >
                    {banners.map((banner) => (
                        <SwiperSlide key={banner.id}>
                            <img src={banner.asset} alt={banner.title} className="w-full h-full object-cover" />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="py-8 flex justify-center">
                    <Button
                        size="lg"
                        className="rounded-none px-12"
                        onClick={() => window.location.href = '/entrance-ticket'}
                    >
                        <TicketIcon className="mr-2 h-6 w-6" />
                        BUY TICKET
                    </Button>
                </div>
            </section>

            {/* Stage Tickets Swiper */}
            <section className="max-w-7xl mx-auto pb-20 md:pt-0 pt-10 px-4">
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        prevEl: '.swiper-button-prev-custom',
                        nextEl: '.swiper-button-next-custom',
                    }}
                    spaceBetween={20}
                    slidesPerView={1.2}
                    breakpoints={{
                        640: { slidesPerView: 2.2 },
                        1024: { slidesPerView: 3.2 }
                    }}
                    className="relative group"
                >
                    {stageTickets.map((ticket) => (
                        <SwiperSlide key={ticket.id}>
                            <Link to={`/stage-ticket/${ticket.slug}`} className="block h-48 rounded-none overflow-hidden relative">
                                <div className="absolute z-10 text-white bg-black/50 px-3 py-1.5 rounded-md m-3 font-semibold">
                                    {ticket.name}
                                </div>
                                <img src={ticket.image} alt={ticket.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                            </Link>
                        </SwiperSlide>
                    ))}

                    {/* Custom Navigation */}
                    <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md text-main-500 hover:bg-white transition-colors">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md text-main-500 hover:bg-white transition-colors">
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </Swiper>
            </section>

            {/* Fashion Section */}
            <section className="max-w-7xl mx-auto py-16 px-4 border-t border-black">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-serif font-bold tracking-tight">FASHION</h2>
                    <p className="text-gray-500 mt-2 text-lg">Discover the latest trends in fashion</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {fashionProducts.map((product) => (
                        <Link key={product.id} to={`/products/${product.slug}`} className="group block">
                            <div className="aspect-square bg-gray-100 overflow-hidden mb-4">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <h3 className="font-semibold text-center group-hover:text-main-500 transition-colors uppercase tracking-wide text-sm">{product.name}</h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Beauty Section */}
            <section className="max-w-7xl mx-auto py-16 px-4 border-t border-black">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-serif font-bold tracking-tight">BEAUTY</h2>
                    <p className="text-gray-500 mt-2 text-lg">Explore our exclusive beauty products</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {beautyProducts.map((product) => (
                        <Link key={product.id} to={`/products/${product.slug}`} className="group block">
                            <div className="aspect-square bg-gray-100 overflow-hidden mb-4">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <h3 className="font-semibold text-center group-hover:text-main-500 transition-colors uppercase tracking-wide text-sm">{product.name}</h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="max-w-7xl mx-auto py-20 px-4 border-t border-black">
                <div className="bg-gray-50 p-12 md:p-20 text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Subscribe to Our Newsletter</h2>
                    <p className="text-gray-600 mb-10 text-lg">Stay updated with our latest news, exclusive offers, and upcoming events.</p>

                    <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            required
                        />
                        <Button className="rounded-none px-10 whitespace-nowrap">
                            SUBSCRIBE
                        </Button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Home;
