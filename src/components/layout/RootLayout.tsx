import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface RootLayoutProps {
    children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow pt-8 md:pt-0">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default RootLayout;
