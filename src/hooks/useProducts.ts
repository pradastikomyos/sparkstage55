import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/**
 * Product interface matching the Shop page requirements
 */
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image?: string;
    badge?: string;
    placeholder?: string;
    slug: string;
    categorySlug?: string | null;
    categoryName?: string;
    defaultVariantId?: number;
    defaultVariantName?: string;
    hasStock: boolean;
}

/**
 * Transform raw Supabase product data into Product interface
 */
type ProductVariantRow = {
    id: unknown;
    name?: unknown;
    price?: unknown;
    attributes?: unknown;
    is_active?: unknown;
    stock?: unknown;
    reserved_stock?: unknown;
};

type ProductImageRow = {
    image_url: string;
    is_primary: boolean;
    display_order: number;
};

type ProductRow = {
    id: unknown;
    name?: unknown;
    slug?: unknown;
    description?: unknown;
    categories?: { name?: unknown; slug?: unknown } | null;
    product_variants?: unknown;
    product_images?: ProductImageRow[];
};

const toNumber = (value: unknown, fallback: number = 0) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
    if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    }
    return fallback;
};

function transformProduct(row: ProductRow): Product {
    const variants: ProductVariantRow[] = Array.isArray(row.product_variants) ? (row.product_variants as ProductVariantRow[]) : [];

    let priceMin = Number.POSITIVE_INFINITY;
    let image: string | undefined;
    let defaultVariantId: number | undefined;
    let defaultVariantName: string | undefined;
    let defaultVariantPrice = Number.POSITIVE_INFINITY;
    let totalStock = 0;

    // Get primary image from product_images table
    const sortedImages = (row.product_images || [])
        .sort((a, b) => {
            if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
            return a.display_order - b.display_order;
        });
    if (sortedImages[0]?.image_url) image = sortedImages[0].image_url;

    // Process variants to find minimum price and default variant
    for (const v of variants) {
        if (v.is_active === false) continue;

        const price = toNumber(v.price, 0);
        if (Number.isFinite(price)) priceMin = Math.min(priceMin, price);

        // Use variant image if product image not available
        if (!image) {
            const attrs =
                v.attributes && typeof v.attributes === 'object' && !Array.isArray(v.attributes)
                    ? (v.attributes as Record<string, unknown>)
                    : null;
            const maybeImage = attrs && typeof attrs.image_url === 'string' ? attrs.image_url : null;
            if (maybeImage) image = maybeImage;
        }

        // Find default variant (first available variant with lowest price)
        const available = toNumber(v.stock, 0) - toNumber(v.reserved_stock, 0);
        const isAvailable = available > 0;
        if (isAvailable && Number.isFinite(price) && price >= 0 && price < defaultVariantPrice) {
            defaultVariantPrice = price;
            defaultVariantId = toNumber(v.id, 0);
            defaultVariantName = typeof v.name === 'string' ? v.name : String(v.name ?? '');
        }
        totalStock += isAvailable ? available : 0;
    }

    if (!Number.isFinite(priceMin)) priceMin = 0;

    const categorySlug = typeof row.categories?.slug === 'string' ? row.categories.slug : null;

    return {
        id: toNumber(row.id, 0),
        name: typeof row.name === 'string' ? row.name : String(row.name ?? ''),
        description: typeof row.description === 'string' ? row.description : String(row.description ?? ''),
        slug: typeof row.slug === 'string' ? row.slug : String(row.slug ?? ''),
        price: priceMin,
        image,
        placeholder: image ? undefined : 'inventory_2',
        categorySlug,
        categoryName: typeof row.categories?.name === 'string' ? row.categories.name : undefined,
        defaultVariantId,
        defaultVariantName,
        hasStock: totalStock > 0,
    };
}

export function useProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('products')
                .select(
                    `
          id,
          name,
          description,
          slug,
          is_active,
          deleted_at,
          categories(name, slug),
          product_images(image_url, is_primary, display_order),
          product_variants(id, name, price, attributes, is_active, stock, reserved_stock)
        `
                )
                .is('deleted_at', null)
                .eq('is_active', true)
                .order('name', { ascending: true });

            if (error) throw error;

            return (data || []).map((row) => transformProduct(row as unknown as ProductRow));
        },
        staleTime: 60000, // 1 minute
        refetchOnWindowFocus: false,
    });
}
