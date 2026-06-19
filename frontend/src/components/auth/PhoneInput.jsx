// components/auth/PhoneInput.jsx
import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PhoneInput = ({ value, onChange, error, disabled }) => {
    const [formattedPhone, setFormattedPhone] = useState('');

    const formatPhoneNumber = (phone) => {
        // Remove all non-digits
        const digits = phone.replace(/\D/g, '');

        // Handle Uzbekistan format: +998 XX XXX XX XX
        if (digits.startsWith('998')) {
            const match = digits.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
            if (match) {
                return `+${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
            }
            return `+${digits}`;
        }

        if (digits.length > 0) {
            return `+998 ${digits.slice(0, 2)}${digits.length > 2 ? ' ' + digits.slice(2, 5) : ''}${digits.length > 5 ? ' ' + digits.slice(5, 7) : ''}${digits.length > 7 ? ' ' + digits.slice(7, 9) : ''}`;
        }

        return '';
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\+998\d{9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    const handleChange = (e) => {
        const inputValue = e.target.value;
        const formatted = formatPhoneNumber(inputValue);
        setFormattedPhone(formatted);

        const cleaned = formatted.replace(/\s/g, '');
        if (validatePhone(cleaned) || cleaned.length === 12) {
            onChange(cleaned);
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
                Telefon raqamingiz
            </label>
            <div className="relative">
                <motion.div
                    className={`relative flex items-center rounded-xl border-2 transition-all duration-200 ${error
                            ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-200'
                            : 'border-neutral-300 focus-within:border-primary-600 focus-within:ring-primary-200'
                        } focus-within:ring-4 bg-white`}
                    whileFocus={{ scale: 1.01 }}
                >
                    <span className="pl-4 text-neutral-500 font-medium">
                        🇺🇿 +998
                    </span>
                    <input
                        type="tel"
                        value={formattedPhone.replace('+998 ', '')}
                        onChange={handleChange}
                        disabled={disabled}
                        placeholder="90 123 45 67"
                        className="w-full px-4 py-3.5 bg-transparent border-none outline-none text-neutral-900 placeholder-neutral-400"
                        maxLength={12}
                    />
                    {value && validatePhone(value) && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mr-4 text-primary-600"
                        >
                            ✓
                        </motion.span>
                    )}
                </motion.div>
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};

export default PhoneInput;