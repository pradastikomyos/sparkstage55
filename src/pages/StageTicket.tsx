import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Ticket as TicketIcon, MapPin, Calendar, Info, ChevronRight, Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import CheckoutTicketModal from '@/components/features/CheckoutTicketModal';
import { useTickets } from '@/hooks/useTickets';
import { useTicketAvailability } from '@/hooks/useTicketAvailability';
import { formatCurrency, formatDate } from '@/utils/formatters';

const StageTicket: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch ticket details
    const { data: ticket, isLoading, error } = useTickets(slug);

    // Fetch availability (only if ticket is loaded)
    const { data: availability } = useTicketAvailability(ticket?.id || null);

    const handleSelectTicket = () => {
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main-500"></div>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Ticket Not Found</h1>
                <p className="text-gray-600 mb-6">The ticket you are looking for does not exist or is no longer available.</p>
                <Button onClick={() => navigate('/')}>Back to Home</Button>
            </div>
        );
    }

    // Determine available dates from availability data
    const availableDates = availability
        ? [...new Set(availability.map(a => a.date))].sort()
        : [];

    // Format date range string
    const dateRange = availableDates.length > 0
        ? `${formatDate(availableDates[0])} ${availableDates.length > 1 ? '- ' + formatDate(availableDates[availableDates.length - 1]) : ''}`
        : 'Dates to be announced';

    return (
        <div className="min-h-screen bg-white">
            {/* Header / Hero */}
            <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop"
                    alt={ticket.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-0 w-full">
                    <div className="container mx-auto px-4 md:px-10">
                        <Badge variant="primary" className="mb-4 uppercase tracking-[0.3em] font-black px-6">
                            {ticket.type}
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-serif font-black text-white uppercase tracking-tighter mb-4">
                            {ticket.name}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-white/80 font-bold uppercase tracking-widest text-xs">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-main-500" />
                                {ticket.type === 'stage' ? 'Exhibition Hall 1' : 'Main Venue'}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-main-500" />
                                {dateRange}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-10 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left: Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-3xl font-serif font-bold mb-6 uppercase tracking-widest border-b-2 border-gray-900 pb-4 inline-block">About Ticket</h2>
                            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl whitespace-pre-line">
                                {ticket.description || 'No description available for this ticket.'}
                            </p>
                        </section>

                        <section className="space-y-8">
                            <div className="flex items-center gap-4">
                                <Star className="h-6 w-6 text-main-500 fill-main-500" />
                                <h2 className="text-3xl font-serif font-bold uppercase tracking-widest">Select Ticket</h2>
                            </div>

                            <div className="grid gap-6">
                                {/* Display single ticket as the option since we query by slug */}
                                <div className="p-8 border-2 border-gray-100 hover:border-main-500 transition-all duration-500 group bg-white relative overflow-hidden">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-2xl font-serif font-black uppercase text-gray-900 group-hover:text-main-500 transition-colors">
                                                    {ticket.name}
                                                </h3>
                                                {!ticket.is_active && (
                                                    <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-0.5 uppercase tracking-tighter">
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-500 leading-relaxed">{ticket.description}</p>
                                        </div>

                                        <div className="flex flex-col items-end gap-4 min-w-[200px]">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</p>
                                                <p className="text-3xl font-serif font-black text-main-500">
                                                    {formatCurrency(ticket.price)}
                                                </p>
                                            </div>
                                            <Button
                                                onClick={handleSelectTicket}
                                                disabled={!ticket.is_active}
                                                className="w-full md:w-auto h-14 px-10 rounded-none font-bold uppercase tracking-[0.2em]"
                                            >
                                                Book Now <ChevronRight className="ml-2 h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Background accent */}
                                    <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                        <TicketIcon size={200} />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right: Sidebar / Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-black p-10 text-white">
                            <h4 className="text-xl font-serif font-bold mb-6 uppercase tracking-widest border-l-4 border-main-500 pl-4">Venue Info</h4>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <MapPin className="h-6 w-6 text-main-500 shrink-0" />
                                    <div>
                                        <p className="font-bold uppercase tracking-widest text-xs mb-1">Location</p>
                                        <p className="text-gray-400 text-sm">International Expo Center, Hall 1-3, Jakarta, Indonesia</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Info className="h-6 w-6 text-main-500 shrink-0" />
                                    <div>
                                        <p className="font-bold uppercase tracking-widest text-xs mb-1">Gate Info</p>
                                        <p className="text-gray-400 text-sm">Main entrance opens 30 minutes before first show.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-2 border-gray-100 p-8">
                            <h4 className="text-xl font-serif font-bold mb-4 uppercase tracking-widest">Need Help?</h4>
                            <p className="text-gray-500 text-sm mb-6 uppercase tracking-wider font-medium">Our support team is available 24/7 during the event days.</p>
                            <Button variant="outline" className="w-full rounded-none border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold h-12 uppercase tracking-widest">
                                Contact Support
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <CheckoutTicketModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                ticket={ticket}
                // If there's only one date/slot available, pre-select or pass null to let user choose in modal
                date={availableDates.length > 0 ? availableDates[0] : null}
                timeSlot={availability && availability.length > 0 ? availability[0].time_slot : null}
            />
        </div>
    );
};

export default StageTicket;

