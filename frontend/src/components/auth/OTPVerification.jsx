// components/auth/OTPVerification.jsx
import  { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OTPVerification = ({ phone, onVerify, onResend, loading }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }

        // Auto-submit when all fields filled
        if (index === 5 && value && newOtp.every(digit => digit !== '')) {
            handleVerify(newOtp.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split('').forEach((digit, index) => {
            if (index < 6) newOtp[index] = digit;
        });
        setOtp(newOtp);

        // Focus last filled input
        const lastIndex = Math.min(pastedData.length - 1, 5);
        inputRefs.current[lastIndex].focus();

        if (pastedData.length === 6) {
            handleVerify(pastedData);
        }
    };

    const handleVerify = (otpCode) => {
        const code = otpCode || otp.join('');
        if (code.length === 6) {
            onVerify(code);
        }
    };

    const handleResend = () => {
        if (canResend) {
            setOtp(['', '', '', '', '', '']);
            setTimeLeft(120);
            setCanResend(false);
            onResend();
            inputRefs.current[0].focus();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto"
        >
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                    Tasdiqlash kodi
                </h2>
                <p className="text-neutral-600">
                    {phone} raqamiga 6 xonali kod yuborildi
                </p>
            </div>

            <div className="mb-8">
                <div
                    className="flex justify-center gap-2 sm:gap-3"
                    onPaste={handlePaste}
                >
                    {otp.map((digit, index) => (
                        <motion.input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            disabled={loading}
                            className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all ${digit
                                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                                    : 'border-neutral-300 bg-white text-neutral-900'
                                } focus:border-primary-600 focus:ring-4 focus:ring-primary-200`}
                            whileFocus={{ scale: 1.1 }}
                            maxLength={1}
                        />
                    ))}
                </div>
            </div>

            <div className="text-center mb-6">
                <AnimatePresence mode="wait">
                    {!canResend ? (
                        <motion.p
                            key="timer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-neutral-600"
                        >
                            Qayta yuborish:{' '}
                            <span className="font-semibold text-primary-700">
                                {formatTime(timeLeft)}
                            </span>
                        </motion.p>
                    ) : (
                        <motion.button
                            key="resend"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={handleResend}
                            className="text-primary-700 font-semibold hover:text-primary-800 transition-colors"
                        >
                            Kodni qayta yuborish
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            <motion.button
                onClick={() => handleVerify()}
                disabled={otp.join('').length !== 6 || loading}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${otp.join('').length === 6 && !loading
                        ? 'bg-primary-700 hover:bg-primary-800 shadow-lg hover:shadow-xl'
                        : 'bg-neutral-300 cursor-not-allowed'
                    }`}
                whileHover={otp.join('').length === 6 && !loading ? { scale: 1.02 } : {}}
                whileTap={otp.join('').length === 6 && !loading ? { scale: 0.98 } : {}}
            >
                {loading ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto"
                    />
                ) : (
                    'Tasdiqlash'
                )}
            </motion.button>
        </motion.div>
    );
};

export default OTPVerification;