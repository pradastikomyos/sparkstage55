import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toLocalDateString } from '../utils/timezone';

export interface Availability {
    id: number;
    date: string;
    time_slot: string | null;
    total_capacity: number;
    reserved_capacity: number;
    sold_capacity: number;
    available_capacity: number;
}

type RawAvailability = {
    id: number;
    date: string;
    time_slot: string | null;
    total_capacity: number;
    reserved_capacity: number;
    sold_capacity: number;
};

export function useTicketAvailability(ticketId: number | null) {
    return useQuery({
        queryKey: ['ticket-availability', ticketId],
        queryFn: async () => {
            if (!ticketId) return [];

            const { data, error } = await supabase
                .from('ticket_availabilities')
                .select('*')
                .eq('ticket_id', ticketId)
                .gte('date', toLocalDateString(new Date()))
                .order('date', { ascending: true })
                .order('time_slot', { ascending: true });

            if (error) throw error;

            return ((data as RawAvailability[] | null) || []).map((avail) => ({
                ...avail,
                available_capacity: avail.total_capacity - avail.reserved_capacity - avail.sold_capacity,
            }));
        },
        enabled: !!ticketId,
        refetchInterval: 30000, // Refresh every 30 seconds
        staleTime: 10000, // Consider stale after 10 seconds
    });
}
