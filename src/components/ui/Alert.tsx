import React from 'react';
import { cn } from '@/utils/cn';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

interface AlertProps {
    variant?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    children: React.ReactNode;
    onClose?: () => void;
    className?: string;
}

const Alert: React.FC<AlertProps> = ({
    variant = 'info',
    title,
    children,
    onClose,
    className
}) => {
    const icons = {
        info: <Info className="h-5 w-5 text-blue-500" />,
        success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        error: <XCircle className="h-5 w-5 text-red-500" />,
    };

    const variants = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        error: 'bg-red-50 border-red-200 text-red-800',
    };

    return (
        <div className={cn(
            'p-4 border-2 rounded-none flex gap-3 relative animate-in fade-in duration-300',
            variants[variant],
            className
        )}>
            <div className="flex-shrink-0 mt-0.5">
                {icons[variant]}
            </div>
            <div className="flex-1">
                {title && <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">{title}</h4>}
                <div className="text-sm font-medium leading-relaxed">
                    {children}
                </div>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="flex-shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors self-start"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export default Alert;
