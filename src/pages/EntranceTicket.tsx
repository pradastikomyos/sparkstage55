import React, { useState } from 'react';
import { Clock, Info, Check, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import CheckoutTicketModal from '@/components/features/CheckoutTicketModal';
import { useActiveTickets } from '@/hooks/useActiveTickets';
import { formatCurrency } from '@/utils/formatters';
import type { TicketData } from '@/types';

const EntranceTicket: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const { data: tickets, isLoading } = useActiveTickets();

    // Filter for entrance tickets
    const entranceTickets = tickets?.filter(t => t.type === 'entrance' || t.type === 'daily_pass') || [];

    // Generate next 7 days availability (Mocking availability logic strictly for dates)
    // Ideally we fetch availability via useTicketAvailability but for Entrance specific logic we might just show open dates
    const generateDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    };

    const dates = generateDates();

    const handleSelectTicket = (ticket: TicketData, date: string) => {
        setSelectedTicket(ticket);
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main-500"></div>
            </div>
        );
    }

    // Fallback if no tickets found
    const displayTickets = entranceTickets.length > 0 ? entranceTickets : [];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-black text-white pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center" />
                <div className="container mx-auto px-4 md:px-10 relative z-10">
                    <Badge variant="ghost" className="text-white border-white mb-6">General Admission</Badge>
                    <h1 className="text-5xl md:text-7xl font-serif font-black uppercase tracking-tighter mb-6">
                        Entrance <span className="text-main-500">Tickets</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed">
                        Access the exhibitions, art installations, and public areas. Experience the creativity without limits.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-10 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Info Block */}
                        <section className="bg-gray-50 p-8 border-l-4 border-main-500">
                            <div className="flex items-start gap-4">
                                <Info className="h-6 w-6 text-main-500 shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold uppercase tracking-widest mb-2">Important Information</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Entrance tickets grant access to all public execution areas, the main hall, and art installations.
                                        Stage performances require a separate Stage Ticket.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-8">
                            <h2 className="text-3xl font-serif font-bold uppercase tracking-widest">Select Date & Ticket</h2>

                            {/* Date Selection */}
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {dates.map((date) => (
                                    <button
                                        key={date}
                                        onClick={() => setSelectedDate(date)}
                                        className={`flex-shrink-0 w-24 h-24 flex flex-col items-center justify-center border-2 transition-all ${selectedDate === date
                                            ? 'border-main-500 bg-main-500 text-white'
                                            : 'border-gray-200 hover:border-main-500 text-gray-400 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className="text-xs font-bold uppercase tracking-widest">
                                            {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                                        </span>
                                        <span className="text-2xl font-black">{new Date(date).getDate()}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Ticket List */}
                            <div className="space-y-6">
                                {displayTickets.length === 0 ? (
                                    <p className="text-gray-500 italic">No tickets available at the moment.</p>
                                ) : (
                                    displayTickets.map((ticket) => (
                                        <div key={ticket.id} className="group border-2 border-gray-100 p-8 hover:border-main-500 transition-all duration-300">
                                            <div className="flex flex-col md:flex-row gap-8 justify-between md:items-center">
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-2xl font-serif font-black uppercase group-hover:text-main-500 transition-colors">
                                                            {ticket.name}
                                                        </h3>
                                                        {!ticket.is_active && (
                                                            <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-0.5 uppercase tracking-tighter">Inactive</span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-500">{ticket.description || 'Standard entry ticket'}</p>

                                                    <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                        <div className="flex items-center gap-2">
                                                            <Check className="h-4 w-4 text-green-500" /> All Exhibitions
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Check className="h-4 w-4 text-green-500" /> Public Areas
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-main-500" /> Valid 1 Day
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-4 min-w-[180px]">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price per person</p>
                                                        <p className="text-3xl font-serif font-black text-main-500">
                                                            {formatCurrency(ticket.price)}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        onClick={() => selectedDate && handleSelectTicket(ticket, selectedDate)}
                                                        disabled={!selectedDate || !ticket.is_active}
                                                        className="w-full rounded-none h-12 font-bold uppercase tracking-widest"
                                                    >
                                                        {selectedDate ? 'Book Now' : 'Select Date'} <ChevronRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-black p-10 text-white">
                            <h4 className="text-xl font-serif font-bold mb-6 uppercase tracking-widest border-l-4 border-main-500 pl-4">Opening Hours</h4>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-400">Weekdays</span>
                                    <span className="font-bold">10:00 - 20:00</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-400">Weekends</span>
                                    <span className="font-bold">09:00 - 22:00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CheckoutTicketModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                ticket={selectedTicket}
                date={selectedDate}
            />
        </div>
    );
};

// End of file
export default EntranceTicket;
