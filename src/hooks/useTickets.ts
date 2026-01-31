import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { TicketData } from '../types';

export function useTickets(slug: string | undefined) {
    return useQuery({
        queryKey: ['ticket', slug],
        queryFn: async () => {
            if (!slug) throw new Error('Slug is required');

            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .eq('slug', slug)
                .eq('is_active', true)
                .single();

            if (error) throw error;
            if (!data) throw new Error('Ticket not found');

            return data as TicketData;
        },
        enabled: !!slug,
        staleTime: 30000, // 30 seconds
        retry: 2,
    });
}
