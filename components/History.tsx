import React from 'react';
import { VideoHistoryItemUI } from '../App';
import { FilmIcon, TrashIcon } from './Icons';

interface HistoryProps {
    items: VideoHistoryItemUI[];
    onView: (item: VideoHistoryItemUI) => void;
    onClear: () => void;
}

export const History: React.FC<HistoryProps> = ({ items, onView, onClear }) => {
    if (items.length === 0) {
        return (
          <div className="mt-12 w-full max-w-5xl mx-auto">
             <h2 className="text-2xl font-bold text-white text-center mb-4">سجل الإنشاء</h2>
             <div className="text-center py-10 px-4 bg-gray-800 border border-dashed border-gray-700 rounded-lg">
                <p className="text-gray-400">لا يوجد فيديوهات منشأة بعد. ابدأ بإنشاء أول فيديو لك!</p>
             </div>
          </div>
        );
    }

    return (
        <div className="mt-12 w-full max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">سجل الإنشاء</h2>
                <button
                    onClick={onClear}
                    className="flex items-center px-3 py-1.5 text-sm bg-red-900/50 hover:bg-red-900/80 text-red-300 hover:text-white rounded-lg transition"
                    aria-label="مسح كل السجل"
                >
                    <TrashIcon className="w-4 h-4 ml-1.5" />
                    مسح السجل
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                    <div key={item.id} className="bg-gray-800 rounded-lg p-4 flex flex-col justify-between border border-gray-700 hover:border-blue-500/80 transition-all duration-200 shadow-lg">
                        <div className="flex-grow">
                             <p className="text-gray-400 text-xs mb-2">
                                {new Date(item.timestamp).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                            <p className="text-white font-normal text-sm leading-relaxed mb-3" style={{ minHeight: '60px', overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}>
                                {item.prompt}
                            </p>
                        </div>
                        <button
                            onClick={() => onView(item)}
                            className="w-full mt-2 flex items-center justify-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-transform transform active:scale-95 text-sm"
                        >
                            <FilmIcon className="w-4 h-4 ml-2" />
                            عرض الفيديو
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
