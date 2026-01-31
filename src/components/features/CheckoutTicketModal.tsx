import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Plus, Minus, Ticket as TicketIcon, Calendar, Clock } from 'lucide-react';
import type { TicketData } from '@/types';

interface CheckoutTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: TicketData | null;
    date: string | null;
    timeSlot?: string | null;
}

const CheckoutTicketModal: React.FC<CheckoutTicketModalProps> = ({
    isOpen,
    onClose,
    ticket,
    date,
    timeSlot
}) => {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!ticket) return null;

    const totalPrice = Number(ticket.price) * quantity;

    const handleProceed = () => {
        setIsProcessing(true);
        // Simulate processing delay
        setTimeout(() => {
            setIsProcessing(false);
            onClose();
            // Navigate to checkout with ticket details
            navigate('/checkout', {
                state: {
                    ticket,
                    quantity,
                    date,
                    timeSlot,
                    totalPrice
                }
            });
        }, 500);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Checkout Ticket"
            className="max-w-md"
        >
            <div className="space-y-6">
                {/* Ticket Info Summary */}
                <div className="bg-gray-50 p-4 border border-gray-100">
                    <div className="flex items-start gap-4">
                        <div className="bg-main-500 p-2 rounded-lg text-white">
                            <TicketIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{ticket.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{ticket.description}</p>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-main-500" />
                            <span>{date}</span>
                        </div>
                        {timeSlot && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="h-4 w-4 text-main-500" />
                                <span>{timeSlot}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quantity Selector */}
                <div className="space-y-3">
                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-700">Quantity</label>
                    <div className="flex items-center justify-between p-4 border-2 border-gray-100 bg-white">
                        <span className="text-gray-600 font-medium">Number of tickets</span>
                        <div className="flex items-center border border-gray-300">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="p-2 hover:bg-gray-100 transition-colors"
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <input
                                type="text"
                                value={quantity}
                                readOnly
                                className="w-12 text-center font-bold"
                            />
                            <button
                                onClick={() => setQuantity(q => Math.min(10, q + 1))}
                                className="p-2 hover:bg-gray-100 transition-colors"
                                disabled={quantity >= 10}
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400 text-right uppercase">Max. 10 tickets per transaction</p>
                </div>

                {/* Price Summary */}
                <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
                    <div>
                        <span className="text-sm text-gray-500 block mb-1 uppercase tracking-widest font-semibold">Total Price</span>
                        <div className="text-3xl font-bold text-main-500 font-serif">
                            Rp {totalPrice.toLocaleString('id-ID')}
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <Button
                    className="w-full h-14 text-lg font-bold rounded-none mt-4"
                    onClick={handleProceed}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'PROCESSING...' : 'PROCEED TO PAYMENT'}
                </Button>
            </div>
        </Modal>
    );
};

export default CheckoutTicketModal;
