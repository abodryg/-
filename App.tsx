import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptForm } from './components/PromptForm';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { VideoResult } from './components/VideoResult';
import { generateVideo } from './services/geminiService';
import { History } from './components/History';
import { addVideoToDB, getAllVideosFromDB, clearAllVideosFromDB, VideoHistoryItem as DBVideoHistoryItem } from './utils/db';

export interface VideoHistoryItemUI extends DBVideoHistoryItem {
  url: string;
}

export type LoadingState = 'idle' | 'generating' | 'polling' | 'downloading';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [submittedPrompt, setSubmittedPrompt] = useState<string>('');
  const [history, setHistory] = useState<VideoHistoryItemUI[]>([]);
  
  // State for prompt form
  const [duration, setDuration] = useState<number>(3);
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const itemsFromDB = await getAllVideosFromDB();
        const itemsWithUrls = itemsFromDB.map(item => ({
          ...item,
          url: URL.createObjectURL(item.videoBlob),
        }));
        setHistory(itemsWithUrls);
      } catch (err) {
        console.error("Failed to load history:", err);
        setError("لم نتمكن من تحميل سجل الإنشاء.");
      }
    };
    loadHistory();

    // Cleanup URLs on unmount
    return () => {
      // Use a function to get the latest state of history during cleanup
      setHistory(currentHistory => {
        currentHistory.forEach(item => URL.revokeObjectURL(item.url));
        return [];
      });
    };
  }, []);

  const handleSubmit = async (prompt: string, image?: File) => {
    setLoadingState('generating');
    setError(null);
    setVideoUrl(null);
    setSubmittedPrompt(prompt);
    
    try {
      const videoBlob = await generateVideo({
        prompt,
        imageFile: image,
        duration,
        aspectRatio,
        onStateChange: (newState) => setLoadingState(newState),
      });
      
      const newItemData = {
        prompt,
        duration,
        aspectRatio,
        timestamp: Date.now(),
        videoBlob,
      };

      const newId = await addVideoToDB(newItemData);
      
      const newHistoryItemUI: VideoHistoryItemUI = {
        ...newItemData,
        id: newId,
        url: URL.createObjectURL(newItemData.videoBlob),
      };

      setHistory(prevHistory => [newHistoryItemUI, ...prevHistory]);
      setVideoUrl(newHistoryItemUI.url);

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoadingState('idle');
    }
  };

  const handleCloseResult = () => {
    setVideoUrl(null);
  };

  const handleViewHistoryItem = (item: VideoHistoryItemUI) => {
    setSubmittedPrompt(item.prompt);
    setVideoUrl(item.url);
  };

  const handleClearHistory = async () => {
    if (window.confirm("هل أنت متأكد أنك تريد مسح كل سجل الإنشاء؟ لا يمكن التراجع عن هذا الإجراء.")) {
      try {
        await clearAllVideosFromDB();
        history.forEach(item => URL.revokeObjectURL(item.url));
        setHistory([]);
      } catch (err) {
        console.error("Failed to clear history:", err);
        setError("لم نتمكن من مسح سجل الإنشاء.");
      }
    }
  };

  const isLoading = loadingState !== 'idle';

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <Header />
        <main className="mt-8">
          <PromptForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
            duration={duration}
            setDuration={setDuration}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
          />
          {isLoading && <Loader state={loadingState} />}
          {error && <ErrorDisplay message={error} onClose={() => setError(null)} />}
          <History 
            items={history}
            onView={handleViewHistoryItem}
            onClear={handleClearHistory}
          />
        </main>
      </div>
      {videoUrl && (
        <VideoResult 
          videoUrl={videoUrl} 
          prompt={submittedPrompt} 
          onClose={handleCloseResult} 
        />
      )}
    </div>
  );
};

export default App;