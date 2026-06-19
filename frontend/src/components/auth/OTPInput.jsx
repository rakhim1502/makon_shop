// frontend/src/components/auth/OTPInput.jsx
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const OTPInput = ({ length = 6, onComplete, error, disabled }) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Keyingi inputga o'tish
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // To'liq bo'lsa
        if (newOtp.every(digit => digit !== '') && onComplete) {
            onComplete(newOtp.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
                <motion.input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={disabled}
                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all ${digit
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-neutral-300 bg-white text-neutral-900'
                        } focus:border-primary-600 focus:ring-4 focus:ring-primary-200`}
                    whileFocus={{ scale: 1.1 }}
                    maxLength={1}
                />
            ))}
        </div>
    );
};

export default OTPInput;