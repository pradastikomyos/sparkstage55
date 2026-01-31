import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ChevronRight, Filter } from 'lucide-react';
import Badge from '@/components/ui/Badge';

const EventPage: React.FC = () => {
    // Mock Data
    const events = [
        {
            id: 1,
            title: 'Spark Fashion Week 2026',
            date: 'Feb 01 - Feb 07, 2026',
            location: 'Main Hall, Expo Center',
            image: 'https://images.unsplash.com/photo-1511733334857-e8908ee8780a?q=80&w=2070&auto=format&fit=crop',
            category: 'Fashion',
            slug: 'fashion-week-2026'
        },
        {
            id: 2,
            title: 'Beauty & Wellness Expo',
            date: 'Feb 10 - Feb 12, 2026',
            location: 'West Wing Garden',
            image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2070&auto=format&fit=crop',
            category: 'Beauty',
            slug: 'beauty-wellness-2026'
        },
        {
            id: 3,
            title: 'Digital Creators Meetup',
            date: 'Feb 15, 2026',
            location: 'Spark Lounge',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
            category: 'Community',
            slug: 'creators-meetup'
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Hero */}
            <section className="bg-black text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-main-500/10 skew-x-12 transform translate-x-20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <Badge variant="primary" className="mb-6 uppercase tracking-[0.4em] font-black px-8 py-2">Calendar 2026</Badge>
                    <h1 className="text-6xl md:text-8xl font-serif font-black uppercase tracking-tighter mb-8 leading-none">
                        Discovery <span className="text-main-500">Events</span>
                    </h1>
                    <p className="text-xl text-white/60 font-medium max-w-2xl leading-relaxed uppercase tracking-widest">
                        Join us at the intersection of fashion, beauty, and digital innovation.
                        Experience the most anticipated events of the season.
                    </p>
                </div>
            </section>

            {/* Filter Bar */}
            <div className="sticky top-20 bg-white border-b border-gray-100 z-30 py-4 shadow-sm md:top-24">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex gap-8 overflow-x-auto no-scrollbar py-2">
                        {['All Events', 'Fashion', 'Beauty', 'Exhibitions', 'Music'].map((cat, i) => (
                            <button key={cat} className={cn(
                                "text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap transition-colors",
                                i === 0 ? "text-main-500 border-b-2 border-main-500" : "text-gray-400 hover:text-gray-900"
                            )}>
                                {cat}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-900 ml-4">
                        <Filter className="h-4 w-4" /> Filter
                    </button>
                </div>
            </div>

            {/* Event List */}
            <section className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {events.map((event) => (
                        <Link
                            key={event.id}
                            to={`/event/${event.slug}`}
                            className="group"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-100">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute top-6 left-6">
                                    <span className="bg-white text-black text-[10px] font-black px-4 py-2 uppercase tracking-widest">
                                        {event.category}
                                    </span>
                                </div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="flex items-center gap-2 text-main-500 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        View Detail
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-serif font-black uppercase text-gray-900 group-hover:text-main-500 transition-colors leading-tight">
                                    {event.title}
                                </h3>
                                <div className="flex flex-col gap-1 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3 w-3 text-main-500" />
                                        {event.date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-3 w-3 text-main-500" />
                                        {event.location}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

// Added missing cn import
import { cn } from '@/utils/cn';

export default EventPage;
