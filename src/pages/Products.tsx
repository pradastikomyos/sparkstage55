import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useCart } from '@/hooks/useCart';
import Button from '@/components/ui/Button';

const Products: React.FC = () => {
    const { data: allProducts = [], isLoading: productsLoading } = useProducts();
    const { data: categoryData = [], isLoading: categoriesLoading } = useCategories();
    const { addItem } = useCart();

    const [search, setSearch] = useState('');
    const [type, setType] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('newest');

    // Transform categories for Select
    const categories = useMemo(() => {
        return categoryData.map(c => ({ value: c.slug, label: c.name }));
    }, [categoryData]);

    const types = [
        { value: 'fashion', label: 'Fashion' },
        { value: 'beauty', label: 'Beauty' },
    ];

    const sortOptions = [
        { value: 'newest', label: 'Terbaru' },
        { value: 'name', label: 'Nama (A-Z)' },
        { value: 'price_low', label: 'Harga Terendah' },
        { value: 'price_high', label: 'Harga Tertinggi' },
    ];

    const filteredProducts = useMemo(() => {
        return allProducts
            .filter(p => {
                const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
                const matchesCategory = category ? p.categorySlug === category : true;
                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                if (sort === 'name') return a.name.localeCompare(b.name);
                if (sort === 'price_low') return a.price - b.price;
                if (sort === 'price_high') return b.price - a.price;
                return b.id - a.id; // Newest
            });
    }, [allProducts, search, category, sort]);

    const handleAddToCart = (productId: number) => {
        const product = allProducts.find(p => p.id === productId);
        if (product) {
            addItem({
                productId: product.id,
                variantId: product.defaultVariantId,
                name: product.name,
                image: product.image || '',
                price: product.price,
                quantity: 1,
                variantAttributes: {}, // Default variant attributes
                type: 'product'
            });
        }
    };

    if (productsLoading || categoriesLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-main-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-3xl font-serif font-bold mb-8">SHOP OUR COLLECTION</h1>

            {/* Filters */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                    <Input
                        placeholder="Cari produk..."
                        value={search}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>

                <Select
                    value={type}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value)}
                    options={types}
                    placeholder="All types"
                />

                <Select
                    value={category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
                    options={categories}
                    placeholder="All categories"
                />

                <Select
                    value={sort}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSort(e.target.value)}
                    options={sortOptions}
                />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={{
                            ...product,
                            type: product.categoryName || '', // Use categoryName for badge
                            category: { name: product.categoryName || '' },
                            image: product.image || '',
                            hasStock: product.hasStock,
                            isPreorder: false // Map if database has this field
                        }}
                        onAddToCart={handleAddToCart}
                    />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-xl">Tidak ada produk ditemukan</p>
                    <Button
                        variant="ghost"
                        onClick={() => { setSearch(''); setType(''); setCategory(''); }}
                        className="mt-4 text-main-500"
                    >
                        Reset Filters
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Products;
