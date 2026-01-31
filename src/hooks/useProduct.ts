import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

type Variant = {
    id: number;
    name: string;
    price: number;
    available: number;
    imageUrl?: string;
    attributes: Record<string, any>;
};

type ProductImageRow = {
    image_url: string;
    is_primary: boolean;
    display_order: number;
};

export type ProductDetail = {
    id: number;
    name: string;
    description: string;
    imageUrl?: string;
    imageUrls: string[];
    variants: Variant[];
    category?: { name: string; slug: string };
};

export function useProduct(slug: string | undefined) {
    return useQuery({
        queryKey: ['product', slug],
        queryFn: async () => {
            if (!slug) throw new Error('Product slug is required');

            const { data, error } = await supabase
                .from('products')
                .select(
                    `
          id,
          name,
          description,
          slug,
          categories(name, slug),
          product_images(image_url, is_primary, display_order),
          product_variants(id, name, price, attributes, is_active, stock, reserved_stock)
        `
                )
                .eq('slug', slug)
                .single();

            if (error) throw error;
            if (!data) throw new Error('Product not found');

            const productRow = data as any;
            const productImages = (productRow.product_images || []) as ProductImageRow[];
            const sortedProductImages = productImages
                .slice()
                .sort((a, b) => {
                    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
                    return a.display_order - b.display_order;
                });
            const imageUrls = sortedProductImages.map((img) => img.image_url).filter(Boolean);
            const primaryImageUrl = productRow.image_url || imageUrls[0] || undefined;

            const variants = (productRow.product_variants || []) as any[];

            const mappedVariants: Variant[] = variants
                .filter((v) => v.is_active !== false)
                .map((v) => {
                    const price = typeof v.price === 'number' ? v.price : Number(v.price ?? 0);
                    const available = Math.max(0, (v.stock ?? 0) - (v.reserved_stock ?? 0));
                    const attributes = v.attributes || {};
                    const imageUrl = attributes.image_url || undefined;
                    return {
                        id: Number(v.id),
                        name: String(v.name),
                        price: Number.isFinite(price) ? price : 0,
                        available,
                        imageUrl: imageUrl || primaryImageUrl,
                        attributes,
                    };
                });

            return {
                id: Number(productRow.id),
                name: String(productRow.name),
                description: String(productRow.description ?? ''),
                imageUrl: primaryImageUrl,
                imageUrls: imageUrls.length > 0 ? imageUrls : [primaryImageUrl].filter(Boolean) as string[],
                variants: mappedVariants,
                category: productRow.categories,
            };
        },
        enabled: !!slug,
        staleTime: 60000,
        refetchOnWindowFocus: false,
    });
}
