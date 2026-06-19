// frontend/src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="text-9xl mb-6"
                >
                    🏔️
                </motion.div>
                <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
                <p className="text-xl text-neutral-600 mb-8">
                    Kechirasiz, sahifa topilmadi
                </p>
                <Link
                    to="/"
                    className="inline-block px-8 py-4 bg-primary-700 text-white rounded-xl font-bold hover:bg-primary-800 transition-all shadow-lg"
                >
                    Bosh sahifaga qaytish
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;