import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, Search, ScanLine } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/utils/cn';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { user, signOut, loggingOut } = useAuth();
    const isAuthenticated = !!user;
    const { totalItems } = useCart();

    const displayName = (user?.user_metadata?.name as string | undefined) || (user?.email ? (user.email.split('@')[0] || '') : '') || 'User';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'on stage', path: '/', slug: 'home' },
        { name: 'event', path: '/event', slug: 'event' },
        { name: 'fashion', path: '/fashion', slug: 'fashion' },
        { name: 'beauty', path: '/beauty', slug: 'beauty' },
        { name: 'spark club', path: '/spark-club', slug: 'spark.club' },
        { name: 'news', path: '/news', slug: 'news' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className={cn("bg-white w-full transition-all duration-300 z-50", isScrolled && "fixed top-0 left-0 right-0 shadow-lg max-h-44 animate-in slide-in-from-top duration-300")}>
            <div className="mx-auto px-4 relative">
                {/* Top Section: Logo, Auth, Search */}
                <div className="flex justify-between items-center py-4">
                    <div className="lg:w-1/3"></div>
                    <div className="w-full lg:w-1/3 text-center">
                        <Link to="/" className="inline-block">
                            <Logo className="h-8 md:h-14 w-auto lg:mx-auto" />
                        </Link>
                    </div>
                    <div className="w-1/2 lg:w-1/3 flex justify-end items-center space-x-6">
                        {/* Desktop actions */}
                        <div className="hidden md:flex items-center space-x-6 relative z-10">
                            <Link to="/cart" className="relative p-2 group">
                                <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-main-500 transition-colors" />
                                {totalItems() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-main-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white tabular-nums">
                                        {totalItems()}
                                    </span>
                                )}
                            </Link>

                            {isAuthenticated ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-bold text-gray-900">Hi, {displayName}</span>
                                    <button
                                        onClick={() => signOut()}
                                        disabled={loggingOut}
                                        className="p-2 text-gray-700 hover:text-main-500 transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="text-sm font-black uppercase tracking-widest text-gray-900 hover:text-main-500 transition-colors"
                                >
                                    Sign In
                                </Link>
                            )}

                            <button aria-label="Search" className="hover:text-main-500 transition-colors">
                                <Search className="h-5 w-5 text-gray-700" />
                            </button>
                            <button aria-label="Scanner" className="hover:text-main-500 transition-colors">
                                <ScanLine className="h-5 w-5 text-gray-700" />
                            </button>
                        </div>

                        {/* Mobile toggle */}
                        <div className="md:hidden flex items-center space-x-4">
                            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md border border-gray-300">
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop Divider */}
                <div className="border-b-2 border-gray-100 absolute w-full left-0 hidden md:block"></div>

                {/* Desktop Bottom Navigation */}
                <div className="hidden md:flex justify-center items-center space-x-12 py-6 text-sm tracking-wider">
                    {navItems.map((item) => (
                        <div key={item.path} className="flex items-center justify-center min-w-[100px]">
                            {isActive(item.path) ? (
                                <Link to={item.path} className="relative inline-flex items-center justify-center px-4 py-2 group">
                                    <div className="absolute inset-0 bg-main-500 [clip-path:polygon(50%_0%,_100%_38%,_82%_100%,_18%_100%,_0%_38%)] scale-110"></div>
                                    <span className="relative z-10 text-white font-bold uppercase text-[10px] leading-tight">
                                        {item.name}
                                    </span>
                                </Link>
                            ) : (
                                <Link to={item.path} className="text-gray-900 font-bold hover:text-main-500 uppercase transition-colors">
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isOpen && (
                <div className="fixed inset-0 bg-white z-[60] md:hidden flex flex-col animate-in fade-in slide-in-from-right duration-300">
                    <div className="flex items-center justify-between px-6 py-6 border-b">
                        <Logo className="h-8 w-auto" />
                        <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 py-8">
                        <nav className="space-y-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "block text-2xl font-serif font-black uppercase tracking-tighter transition-colors",
                                        isActive(item.path) ? "text-main-500" : "text-gray-900"
                                    )}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-12 pt-12 border-t border-gray-100 space-y-6">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-main-100 flex items-center justify-center text-main-500 font-bold text-xl">
                                            {displayName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{displayName}</p>
                                            <p className="text-sm text-gray-500">{user?.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { signOut(); setIsOpen(false); }}
                                        disabled={loggingOut}
                                        className="w-full px-6 py-4 bg-gray-100 text-gray-900 font-bold uppercase tracking-widest text-center"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="block w-full px-6 py-4 bg-main-500 text-white font-bold uppercase tracking-widest text-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sign In
                                </Link>
                            )}
                            <Link
                                to="/cart"
                                className="flex items-center justify-between w-full px-6 py-4 border-2 border-gray-900 font-bold uppercase tracking-widest"
                                onClick={() => setIsOpen(false)}
                            >
                                Cart ({totalItems()})
                                <ShoppingCart className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
