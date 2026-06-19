import { useState, useRef } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/helpers';

const ImageUpload = ({ images, onChange }) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Rasm hajmi 5MB dan oshmasligi kerak');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const res = await api.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const newImage = {
                url: res.data.data.url, // /uploads/equipment/...
                filename: res.data.data.filename,
                isPrimary: images.length === 0,
            };

            onChange([...images, newImage]);
            toast.success('Rasm yuklandi ✅');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Rasm yuklashda xatolik');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveImage = async (index) => {
        const image = images[index];

        if (image.filename) {
            try {
                await api.delete('/upload/image', { data: { filename: image.filename } });
            } catch (error) {
                console.error('Rasmni o\'chirishda xatolik:', error);
            }
        }

        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
        toast.success('Rasm o\'chirildi');
    };

    const handleSetPrimary = (index) => {
        const newImages = images.map((img, i) => ({
            ...img,
            isPrimary: i === index,
        }));
        onChange(newImages);
    };

    return (
        <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Rasmlar
            </label>

            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={getImageUrl(image.url)}
                                alt={`Rasm ${index + 1}`}
                                className="w-full h-32 object-cover rounded-xl border-2 border-neutral-200"
                                onError={(e) => {
                                    e.target.src = '/placeholder.jpg';
                                }}
                            />
                            {image.isPrimary && (
                                <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                                    Asosiy
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                <button
                                    type="button"
                                    onClick={() => handleSetPrimary(index)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                                >
                                    Asosiy qilish
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
                                >
                                    O'chirish
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-primary-600 transition-colors">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                    {uploading ? (
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <p className="text-sm text-neutral-600">Yuklanmoqda...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 text-neutral-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm font-semibold text-neutral-700">Rasm yuklash</p>
                            <p className="text-xs text-neutral-500 mt-1">JPG, PNG, GIF (max 5MB)</p>
                        </div>
                    )}
                </label>
            </div>
        </div>
    );
};

export default ImageUpload;