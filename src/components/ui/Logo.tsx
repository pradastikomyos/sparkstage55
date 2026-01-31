import React from 'react';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <div className={`font-serif text-4xl font-bold flex items-center ${className}`}>
            <span className="text-main-500">SPARK</span>
        </div>
    );
};

export default Logo;
