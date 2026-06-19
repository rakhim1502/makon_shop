// frontend/src/pages/Login.jsx
import  { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneInput from '../components/auth/PhoneInput';
import OTPInput from '../components/auth/OTPInput';
import { sendOTP, verifyOTP, clearError } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, otpSent } = useSelector((state) => state.auth);

    const [phone, setPhone] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleSendOTP = (e) => {
        e.preventDefault();
        if (phone.length === 12) {
            dispatch(sendOTP(phone));
            setTimeLeft(120); // 2 daqiqa
        }
    };

    const handleVerifyOTP = (otpCode) => {
        dispatch(verifyOTP({ phone, otp: otpCode })).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/');
            }
        });
    };

    const handleResendOTP = () => {
        dispatch(sendOTP(phone));
        setTimeLeft(120);
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        className="w-16 h-16 bg-primary-700 rounded-full mx-auto mb-4 flex items-center justify-center"
                    >
                        <span className="text-3xl">🏕️</span>
                    </motion.div>
                    <h1 className="text-2xl font-bold text-neutral-900">Makon.Shop</h1>
                    <p className="text-neutral-600 mt-2">
                        {otpSent ? 'Tasdiqlash kodini kiriting' : 'Sayohat jihozlarini ijaraga oling'}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {!otpSent ? (
                        <motion.form
                            key="phone"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleSendOTP}
                            className="space-y-6"
                        >
                            <PhoneInput
                                value={phone}
                                onChange={setPhone}
                                error={error}
                                disabled={loading}
                            />

                            <motion.button
                                type="submit"
                                disabled={phone.length !== 12 || loading}
                                className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${phone.length === 12 && !loading
                                        ? 'bg-primary-700 hover:bg-primary-800 shadow-lg'
                                        : 'bg-neutral-300 cursor-not-allowed'
                                    }`}
                                whileHover={phone.length === 12 && !loading ? { scale: 1.02 } : {}}
                                whileTap={phone.length === 12 && !loading ? { scale: 0.98 } : {}}
                            >
                                {loading ? 'Yuborilmoqda...' : 'Kodni yuborish'}
                            </motion.button>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="otp"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center">
                                <p className="text-sm text-neutral-600 mb-4">
                                    <span className="font-semibold text-neutral-900">+998 {phone.slice(3, 5)} {phone.slice(5, 8)} {phone.slice(8, 10)} {phone.slice(10, 12)}</span> raqamiga kod yuborildi
                                </p>
                            </div>

                            <OTPInput
                                onComplete={handleVerifyOTP}
                                error={error}
                                disabled={loading}
                            />

                            <div className="text-center">
                                {timeLeft > 0 ? (
                                    <p className="text-sm text-neutral-600">
                                        Qayta yuborish: <span className="font-bold text-primary-700">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                                    </p>
                                ) : (
                                    <button
                                        onClick={handleResendOTP}
                                        className="text-sm font-semibold text-primary-700 hover:text-primary-800"
                                    >
                                        Kodni qayta yuborish
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={() => dispatch(clearError())}
                                className="w-full text-sm text-neutral-500 hover:text-neutral-700"
                            >
                                ← Raqamni o'zgartirish
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Login;