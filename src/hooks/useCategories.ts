import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface Category {
    name: string;
    slug: string;
}

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('name, slug')
                .eq('is_active', true)
                .order('name', { ascending: true });

            if (error) throw error;
            return (data || []) as Category[];
        },
        staleTime: 300000, // 5 minutes
        refetchOnWindowFocus: false,
    });
}
