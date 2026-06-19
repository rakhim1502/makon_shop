// frontend/src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-neutral-900 text-neutral-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🏕️</span>
                            </div>
                            <span className="text-xl font-bold text-white">Makon.Shop</span>
                        </div>
                        <p className="text-neutral-400 max-w-md">
                            Sayohat va aktiv dam olish uchun sifatli jihozlar ijarasi. O'zbekiston bo'ylab yetkazib berish xizmati.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Havolalar</h3>
                        <ul className="space-y-2">
                            <li><Link to="/equipment" className="hover:text-primary-400 transition-colors">Jihozlar</Link></li>
                            <li><Link to="/about" className="hover:text-primary-400 transition-colors">Biz haqimizda</Link></li>
                            <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Aloqa</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Bog'lanish</h3>
                        <ul className="space-y-2 text-neutral-400">
                            <li>📞 +998 90 123 45 67</li>
                            <li>📧 info@makon.shop</li>
                            <li>📍 Toshkent, O'zbekiston</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-500">
                    <p>&copy; 2026 Makon.Shop. Barcha huquqlar himoyalangan.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;