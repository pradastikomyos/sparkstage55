import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: number;
    productId: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    variantId?: number;
    variantAttributes: Record<string, string>;
    type: 'product' | 'ticket';
}

interface CartStore {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'id'>) => void;
    removeItem: (itemId: number) => void;
    updateQuantity: (itemId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

const getVariantAttributesKey = (variantAttributes: Record<string, string>) => {
    const keys = Object.keys(variantAttributes).sort();
    return keys.map((key) => `${key}:${variantAttributes[key]}`).join('|');
};

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const newVariantAttributesKey = getVariantAttributesKey(item.variantAttributes);
                const existingItem = get().items.find(
                    (i) =>
                        i.productId === item.productId &&
                        i.variantId === item.variantId &&
                        getVariantAttributesKey(i.variantAttributes) === newVariantAttributesKey
                );

                if (existingItem) {
                    set((state) => ({
                        items: state.items.map((i) =>
                            i.productId === item.productId &&
                                i.variantId === item.variantId &&
                                getVariantAttributesKey(i.variantAttributes) === newVariantAttributesKey
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        ),
                    }));
                } else {
                    set((state) => ({
                        items: [...state.items, { ...item, id: Date.now() }],
                    }));
                }
            },

            removeItem: (itemId) => {
                set((state) => ({
                    items: state.items.filter((i) => i.id !== itemId),
                }));
            },

            updateQuantity: (itemId, quantity) => {
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),

            totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

            totalPrice: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        }),
        {
            name: 'spark-cart-storage',
        }
    )
);
