import React from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'primary',
    className
}) => {
    const variants = {
        primary: 'bg-main-50 text-main-500 border border-main-100',
        secondary: 'bg-gray-100 text-gray-700 border border-gray-200',
        success: 'bg-green-50 text-green-600 border border-green-100',
        warning: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
        danger: 'bg-red-50 text-red-600 border border-red-100',
        ghost: 'bg-transparent border border-gray-200 text-gray-600',
    };

    return (
        <span className={cn(
            'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
};

export default Badge;
