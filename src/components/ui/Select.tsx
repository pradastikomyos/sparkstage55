import React from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: SelectOption[];
    placeholder?: string;
    error?: string;
}

const Select: React.FC<SelectProps> = ({
    options,
    placeholder,
    error,
    className,
    ...props
}) => {
    return (
        <div className="w-full relative">
            <select
                className={cn(
                    'w-full px-4 py-3 bg-white border border-gray-300 appearance-none focus:outline-none focus:border-main-500 transition-colors cursor-pointer',
                    error && 'border-red-500',
                    className
                )}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown className="h-4 w-4" />
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Select;
