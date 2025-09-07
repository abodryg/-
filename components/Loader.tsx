import React from 'react';
import { FilmIcon } from './Icons';
import { LoadingState } from '../App';

interface LoaderProps {
  state: LoadingState;
}

const loadingMessages: Record<Exclude<LoadingState, 'idle'>, { title: string; subtitle: string }> = {
    generating: {
        title: "جارٍ إرسال طلبك...",
        subtitle: "يتم الآن التواصل مع نماذج الذكاء الاصطناعي."
    },
    polling: {
        title: "يقوم الذكاء الاصطناعي بإنشاء الفيديو...",
        subtitle: "قد تستغرق هذه العملية بضع دقائق. يرجى التحلي بالصبر."
    },
    downloading: {
        title: "اكتمل الإنشاء تقريباً!",
        subtitle: "جارٍ تحميل الفيديو النهائي لك."
    }
};

export const Loader: React.FC<LoaderProps> = ({ state }) => {
  if (state === 'idle') {
    return null;
  }
  
  const { title, subtitle } = loadingMessages[state];

  return (
    <div className="mt-8 flex flex-col items-center justify-center p-8 bg-gray-800/50 border border-gray-700 rounded-lg animate-fade-in">
      <div className="relative flex items-center justify-center">
        <FilmIcon className="w-16 h-16 text-blue-400 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/30 rounded-full animate-spin-slow"></div>
      </div>
      <p className="mt-6 text-lg text-gray-300 text-center">{title}</p>
      <p className="mt-2 text-sm text-gray-500 text-center">
        {subtitle}
      </p>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};