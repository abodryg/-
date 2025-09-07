import React, { useEffect, useState } from 'react';
import { DownloadIcon, XIcon, CopyIcon, CheckIcon } from './Icons';

interface VideoResultProps {
  videoUrl: string;
  prompt: string;
  onClose: () => void;
}

export const VideoResult: React.FC<VideoResultProps> = ({ videoUrl, prompt, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    const fileName = prompt.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 50) || 'generated-video';
    link.download = `${fileName}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
      <div
        className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-3xl max-h-[90vh] flex flex-col animate-scale-in"
        onClick={handleModalContentClick}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">الفيديو الخاص بك جاهز!</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition"
            aria-label="إغلاق النافذة"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <main className="p-6 flex-grow overflow-y-auto">
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-black mb-4">
            <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain">
              متصفحك لا يدعم وسم الفيديو.
            </video>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">الوصف</p>
              <button
                onClick={handleCopyPrompt}
                className="flex items-center px-2 py-1 text-xs bg-gray-600/50 hover:bg-gray-600 rounded-md text-gray-300 hover:text-white transition disabled:opacity-50"
                disabled={isCopied}
              >
                {isCopied ? (
                  <>
                    <CheckIcon className="w-4 h-4 ml-1 text-green-400" />
                    تم النسخ!
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-4 h-4 ml-1" />
                    نسخ
                  </>
                )}
              </button>
            </div>
            <p className="text-white font-light">{prompt}</p>
          </div>
        </main>

        <footer className="p-4 border-t border-gray-700 flex-shrink-0">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-transform transform active:scale-95 shadow-lg"
          >
            <DownloadIcon className="w-5 h-5 ml-2" />
            تنزيل الفيديو
          </button>
        </footer>
      </div>
    </div>
  );
};