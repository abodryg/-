import React from 'react';
import { AlertTriangleIcon, XIcon } from './Icons';

interface ErrorDisplayProps {
  message: string;
  onClose: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onClose }) => {
  return (
    <div className="mt-8 flex items-center justify-between p-4 bg-red-900/50 border border-red-500/60 text-red-300 rounded-lg animate-fade-in">
      <div className="flex items-center">
        <AlertTriangleIcon className="w-5 h-5 ml-3 text-red-400" />
        <p className="text-sm">{message}</p>
      </div>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-red-500/20" aria-label="إغلاق رسالة الخطأ">
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
};