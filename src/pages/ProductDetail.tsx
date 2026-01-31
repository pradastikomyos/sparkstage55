import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { ShoppingCart, Star, Share2, Plus, Minus, Info, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import type { Swiper as SwiperType } from 'swiper';
import { useProduct } from '@/hooks/useProduct';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/utils/cn';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const ProductDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { data: product, isLoading, error } = useProduct(slug);
    const addItem = useCart((state) => state.addItem);

    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

    const defaultSelectedAttributes = useMemo(() => {
        if (!product || product.variants.length === 0) return {};
        const firstVariant = product.variants[0];
        const initialAttrs: Record<string, string> = {};
        Object.entries(firstVariant.attributes).forEach(([key, value]) => {
            if (key !== 'image_url') {
                initialAttrs[key] = String(value);
            }
        });
        return initialAttrs;
    }, [product]);

    const effectiveSelectedAttributes =
        Object.keys(selectedAttributes).length > 0 ? selectedAttributes : defaultSelectedAttributes;

    // Extract unique attribute values for selection
    const variantAttributes = useMemo(() => {
        if (!product) return {};
        const attrs: Record<string, Set<string>> = {};
        product.variants.forEach(v => {
            Object.entries(v.attributes).forEach(([key, value]) => {
                if (key === 'image_url') return;
                if (!attrs[key]) attrs[key] = new Set();
                attrs[key].add(String(value));
            });
        });

        const result: Record<string, string[]> = {};
        Object.entries(attrs).forEach(([key, values]) => {
            result[key] = Array.from(values);
        });
        return result;
    }, [product]);

    const selectedVariant = useMemo(() => {
        if (!product) return null;
        return product.variants.find(v => {
            return Object.entries(effectiveSelectedAttributes).every(([key, value]) => {
                return String(v.attributes[key]) === value;
            });
        });
    }, [product, effectiveSelectedAttributes]);

    const isAvailable = selectedVariant && selectedVariant.available > 0;

    const handleAddToCart = () => {
        if (!product || !selectedVariant) return;
        addItem({
            productId: product.id,
            variantId: selectedVariant.id,
            name: product.name,
            image: selectedVariant.imageUrl || product.imageUrl || '',
            price: selectedVariant.price,
            quantity: quantity,
            variantAttributes: effectiveSelectedAttributes,
            type: 'product'
        });
        // Optional: show success toast or redirect to cart
    };

    const handleBuyNow = () => {
        if (!product || !selectedVariant) return;
        const buyNowItem = {
            productId: product.id,
            variantId: selectedVariant.id,
            name: product.name,
            image: selectedVariant.imageUrl || product.imageUrl || '',
            price: selectedVariant.price,
            quantity: quantity,
            variantAttributes: effectiveSelectedAttributes,
            type: 'product' as const
        };
        navigate('/checkout', { state: { items: [buyNowItem] } });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-main-500 animate-spin" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <h2 className="text-2xl font-bold">Product not found</h2>
                <Link to="/products">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center space-x-2 text-gray-600">
                        <li><Link to="/products" className="hover:text-main-500">Products</Link></li>
                        <li>/</li>
                        {product.category && (
                            <>
                                <li><span className="hover:text-main-500">{product.category.name}</span></li>
                                <li>/</li>
                            </>
                        )}
                        <li className="text-gray-900 font-medium">{product.name}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <Swiper
                            modules={[Navigation, Thumbs]}
                            spaceBetween={10}
                            navigation
                            thumbs={{ swiper: thumbsSwiper }}
                            className="aspect-square bg-gray-100 rounded-none overflow-hidden"
                        >
                            {product.imageUrls.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {product.imageUrls.length > 1 && (
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={10}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[Navigation, Thumbs]}
                                className="h-24"
                            >
                                {product.imageUrls.map((img, idx) => (
                                    <SwiperSlide key={idx} className="cursor-pointer opacity-40 [&.swiper-slide-thumb-active]:opacity-100 transition-opacity">
                                        <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover border border-gray-200" />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}

                        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                                {product.category && (
                                    <Badge variant="primary" className="rounded-full px-4 py-1">
                                        {product.category.name.toUpperCase()}
                                    </Badge>
                                )}
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
                                    <Share2 className="h-5 w-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">{product.name}</h1>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={cn("h-5 w-5", i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />
                                    ))}
                                    <span className="ml-2 text-sm text-gray-600 font-medium">
                                        4.5 (82 reviews)
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="bg-main-50 p-6 border-l-4 border-main-500">
                            <span className="text-sm font-semibold uppercase text-main-600 block mb-1">Price</span>
                            <div className="text-4xl font-bold text-main-500">
                                Rp {selectedVariant ? selectedVariant.price.toLocaleString('id-ID') : product.variants[0]?.price.toLocaleString('id-ID')}
                            </div>
                        </div>

                        {/* Variant Selectors */}
                        <div className="space-y-6">
                            {Object.entries(variantAttributes).map(([attrKey, attrValues]) => (
                                <div key={attrKey}>
                                    <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
                                        {attrKey}: <span className="text-main-500 font-medium ml-1">{effectiveSelectedAttributes[attrKey]}</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {attrValues.map((value) => (
                                            <button
                                                key={value}
                                                onClick={() => setSelectedAttributes(prev => ({ ...prev, [attrKey]: value }))}
                                                className={cn(
                                                    "px-6 py-2 border-2 transition-all font-semibold",
                                                    effectiveSelectedAttributes[attrKey] === value
                                                        ? "border-main-500 bg-main-50 text-main-500 ring-1 ring-main-500"
                                                        : "border-gray-200 hover:border-gray-400 text-gray-600"
                                                )}
                                            >
                                                {value}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Availability & Quantity */}
                        <div className="space-y-4">
                            {isAvailable ? (
                                <div className="flex items-center text-green-600 font-semibold gap-2">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <span>Stock available ({selectedVariant?.available} items)</span>
                                </div>
                            ) : (
                                <div className="p-4 bg-red-50 text-red-600 font-semibold rounded-none flex items-center gap-2">
                                    <Info className="h-5 w-5" />
                                    <span>Out of stock for this selection</span>
                                </div>
                            )}

                            {isAvailable && (
                                <div className="flex items-center space-x-6 pt-4">
                                    <div className="flex items-center border-2 border-gray-200 h-12">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="px-4 hover:bg-gray-100 transition-colors"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <input
                                            type="text"
                                            value={quantity}
                                            readOnly
                                            className="w-12 text-center font-bold text-lg"
                                        />
                                        <button
                                            onClick={() => setQuantity(q => Math.min(selectedVariant?.available || 1, q + 1))}
                                            className="px-4 hover:bg-gray-100 transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <span className="text-gray-500 text-sm">Limit: {selectedVariant?.available} items</span>
                                </div>
                            )}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <Button
                                variant="outline"
                                size="lg"
                                className="flex-1 rounded-none border-2 h-14 uppercase tracking-widest bg-white"
                                disabled={!isAvailable}
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Add to Cart
                            </Button>
                            <Button
                                size="lg"
                                className="flex-1 rounded-none h-14 uppercase tracking-widest font-bold"
                                disabled={!isAvailable}
                                onClick={handleBuyNow}
                            >
                                Buy It Now
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Description & Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-gray-200 py-16">
                    <div className="lg:col-span-2">
                        <h3 className="text-2xl font-serif font-bold mb-6">Product Story</h3>
                        <div className="prose prose-lg text-gray-600 leading-relaxed">
                            <p>{product.description}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-8">
                        <h3 className="text-xl font-serif font-bold mb-6">Details</h3>
                        <ul className="space-y-4 text-gray-700">
                            <li className="flex gap-3">
                                <span className="text-main-500 font-bold">•</span>
                                <span>Authentic high-quality materials</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-main-500 font-bold">•</span>
                                <span>Official Spark merchandise</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-main-500 font-bold">•</span>
                                <span>Limited edition collection</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
