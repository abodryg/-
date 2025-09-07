// Fix: Implement the PromptForm component for user input.
import React, { useState, useRef } from 'react';
import { SparklesIcon, UploadIcon, XIcon } from './Icons';
import { ASPECT_RATIOS } from '../constants';

interface PromptFormProps {
  onSubmit: (prompt: string, image?: File) => void;
  isLoading: boolean;
  duration: number;
  setDuration: (duration: number) => void;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
}

export const PromptForm: React.FC<PromptFormProps> = ({ onSubmit, isLoading, duration, setDuration, aspectRatio, setAspectRatio }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        alert("يجب ألا يتجاوز حجم الصورة 4 ميجابايت.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!prompt.trim() || isLoading) {
      return;
    }
    onSubmit(prompt, imageFile || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 w-full max-w-3xl mx-auto">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="مثال: لقطة سينمائية لراكون رائد فضاء يمشي في الفضاء..."
          className="w-full h-32 p-4 pl-12 text-lg text-white bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none shadow-md"
          disabled={isLoading}
          required
        />
        <div className="absolute top-4 left-4 text-gray-400">
          <SparklesIcon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="duration-slider" className="block text-sm font-medium text-gray-400 mb-2">
          مدة الفيديو: <span className="font-bold text-white">{duration} ثواني</span>
        </label>
        <input
          id="duration-slider"
          type="range"
          min="1"
          max="10"
          step="1"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value, 10))}
          disabled={isLoading}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          نسبة العرض إلى الارتفاع
        </label>
        <div className="grid grid-cols-3 gap-3">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.value}
              type="button"
              onClick={() => setAspectRatio(ratio.value)}
              disabled={isLoading}
              className={`py-2 px-4 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                aspectRatio === ratio.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {ratio.label} ({ratio.value})
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-auto">
          <input
            type="file"
            id="image-upload"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            disabled={isLoading}
          />
          <label
            htmlFor="image-upload"
            className={`flex items-center justify-center w-full px-6 py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 cursor-pointer hover:bg-gray-700/50 hover:border-gray-500 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <UploadIcon className="w-5 h-5 ml-2" />
            <span>{imageFile ? "تغيير الصورة" : "إضافة صورة (اختياري)"}</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-transform transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          disabled={isLoading || !prompt.trim()}
        >
          <SparklesIcon className="w-6 h-6 ml-2" />
          إنشاء
        </button>
      </div>

      {imagePreview && (
        <div className="mt-4 relative w-40 h-40 rounded-lg overflow-hidden border-2 border-gray-700 shadow-md">
          <img src={imagePreview} alt="معاينة الصورة" className="w-full h-full object-cover" />
          <button
            onClick={handleRemoveImage}
            className="absolute top-1 left-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/80 transition"
            aria-label="إزالة الصورة"
            type="button"
            disabled={isLoading}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </form>
  );
};