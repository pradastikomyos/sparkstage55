import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { TicketData } from '../types';

export function useActiveTickets() {
    return useQuery({
        queryKey: ['active-tickets'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .eq('is_active', true)
                .order('price', { ascending: true });

            if (error) throw error;
            return (data || []) as TicketData[];
        },
        staleTime: 60000,
    });
}
