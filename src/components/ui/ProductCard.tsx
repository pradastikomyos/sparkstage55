import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';

export interface Product {
    id: number;
    name: string;
    slug: string;
    type: string;
    category: { name: string };
    image: string;
    price: number;
    hasStock: boolean;
    isPreorder: boolean;
}

interface ProductCardProps {
    product: Product;
    onAddToCart: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    return (
        <div className="bg-white rounded-none shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="aspect-square relative flex-shrink-0">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                {product.type && (
                    <Badge variant="primary" className="absolute top-2 right-2 rounded-lg">
                        {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                    </Badge>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 h-14">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.category.name}</p>

                <div className="mb-4 mt-auto">
                    <p className="text-xl font-bold text-black">
                        Rp {product.price.toLocaleString('id-ID')}
                    </p>
                    {product.isPreorder && (
                        <Badge variant="warning" className="mt-1">
                            Pre-order
                        </Badge>
                    )}
                </div>

                <div className="flex space-x-2">
                    <Link
                        to={`/products/${product.slug}`}
                        className="flex-1 px-4 py-2 border border-main-500 text-main-500 rounded-none text-center hover:bg-gray-100 transition text-sm font-semibold"
                    >
                        Detail
                    </Link>
                    {product.hasStock ? (
                        <Button
                            onClick={() => onAddToCart(product.id)}
                            className="flex-1 rounded-none text-sm group"
                        >
                            <ShoppingCart className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Add Cart
                        </Button>
                    ) : (
                        <Button
                            disabled
                            className="flex-1 bg-gray-300 text-gray-500 rounded-none cursor-not-allowed hover:bg-gray-300 text-sm"
                        >
                            Stok Habis
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
