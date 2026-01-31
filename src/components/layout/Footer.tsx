import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/ui/Logo';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-white py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div>
                        <Logo className="fill-white mb-4 -ml-4" />
                        <p className="text-gray-300 text-sm">
                            Discover the latest trends in fashion and beauty. Spark your lifestyle with our exclusive collections and events.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="text-gray-300 hover:text-white transition">Home</Link></li>
                            <li><Link to="/" className="text-gray-300 hover:text-white transition">On Stage</Link></li>
                            <li><Link to="/event" className="text-gray-300 hover:text-white transition">Event</Link></li>
                            <li><Link to="/fashion" className="text-gray-300 hover:text-white transition">Fashion</Link></li>
                            <li><Link to="/beauty" className="text-gray-300 hover:text-white transition">Beauty</Link></li>
                            <li><Link to="/spark-club" className="text-gray-300 hover:text-white transition">Spark Club</Link></li>
                            <li><Link to="/news" className="text-gray-300 hover:text-white transition">News</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <div className="text-gray-300 text-sm space-y-2">
                            <p>Email: contact@spark.com</p>
                            <p>Phone: +62 123 4567 890</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} Spark. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
