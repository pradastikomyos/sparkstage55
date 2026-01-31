import React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}) => {
    const variants = {
        primary: 'bg-main-500 text-white hover:bg-main-600',
        secondary: 'bg-black text-white hover:bg-gray-800',
        outline: 'border border-main-500 text-main-500 hover:bg-main-50',
        ghost: 'hover:bg-gray-100 text-gray-700',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3.5 text-lg',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
};

export default Button;
