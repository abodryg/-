// Fix: Implement the geminiService to interact with the Google GenAI API for video generation.
import { GoogleGenAI } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";
import { LoadingState } from '../App';


// Initialize the Google GenAI client
// Fix: Initialize GoogleGenAI with a named apiKey parameter as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface GenerateVideoParams {
  prompt: string;
  duration: number; // Duration in seconds
  aspectRatio: string; // e.g., '16:9'
  imageFile?: File;
  onStateChange: (state: Extract<LoadingState, 'polling' | 'downloading'>) => void;
}

/**
 * Translates API errors into user-friendly Arabic messages.
 * @param error The error object caught from the API call.
 * @returns A user-friendly error string.
 */
const getApiErrorMessage = (error: any): string => {
    console.error("Full API Error:", error);

    // Check for fetch response errors from our own code
    if (error instanceof Error && error.message.startsWith('فشل في جلب الفيديو')) {
         return "حدث خطأ أثناء تحميل الفيديو النهائي. قد تكون المشكلة مؤقتة، يرجى المحاولة مرة أخرى.";
    }

    // Check for common error messages from the Google GenAI SDK
    if (error.message) {
        if (error.message.includes('API key not valid')) {
            return "مفتاح API غير صالح. يرجى التأكد من تكوين المفتاح بشكل صحيح من جانب المسؤول.";
        }
        if (error.message.toLowerCase().includes('rate limit')) {
            return "لقد تجاوزت حد الطلبات المسموح به. يرجى الانتظار قليلاً ثم المحاولة مرة أخرى.";
        }
        if (error.message.toLowerCase().includes('blocked')) {
            return "تم حظر طلبك لأنه قد ينتهك سياسات السلامة. يرجى تعديل الوصف النصي والمحاولة مرة أخرى.";
        }
        if (error.message.toLowerCase().includes('invalid argument')) {
            return "تم رفض الطلب بسبب مدخلات غير صالحة. يرجى التحقق من الوصف والصورة.";
        }
    }
    
    // Check for HTTP status code if available on the error object
    const status = error.httpStatus || error.status;
    if (status) {
        if (status === 400) {
            return "تم رفض الطلب بسبب مدخلات غير صالحة. يرجى التحقق من الوصف والصورة.";
        }
        if (status >= 500) {
            return "حدث خطأ مؤقت في خوادم Google. يرجى المحاولة مرة أخرى لاحقًا.";
        }
    }

    // Generic fallback for other errors
    return "حدث خطأ غير متوقع أثناء إنشاء الفيديو. يرجى المحاولة مرة أخرى.";
};


export const generateVideo = async ({
  prompt,
  duration,
  aspectRatio,
  imageFile,
  onStateChange,
}: GenerateVideoParams): Promise<Blob> => {
  try {
    // Fix: Add duration and aspect ratio to the prompt as they are not direct API parameters for video generation.
    const fullPrompt = `${prompt}, a ${duration}-second video, aspect ratio ${aspectRatio}.`;

    // Fix: Use correct model 'veo-2.0-generate-001' for video generation.
    const generateVideosParams: {
        model: string;
        prompt: string;
        image?: { imageBytes: string, mimeType: string };
        config: { numberOfVideos: number };
    } = {
        model: 'veo-2.0-generate-001',
        prompt: fullPrompt,
        config: {
            numberOfVideos: 1,
        }
    };

    if (imageFile) {
        const base64Image = await fileToBase64(imageFile);
        generateVideosParams.image = {
            imageBytes: base64Image,
            mimeType: imageFile.type,
        };
    }

    // Fix: Call generateVideos for video generation as per guidelines.
    let operation = await ai.models.generateVideos(generateVideosParams);

    onStateChange('polling');

    // Fix: Poll the operation status until it's done, as video generation is asynchronous.
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
        throw new Error("لم يتم العثور على رابط تنزيل الفيديو في الاستجابة.");
    }

    onStateChange('downloading');

    // Fix: Append API key to download link and fetch video as a blob to create a usable URL for the video tag.
    const videoUrlWithKey = `${downloadLink}&key=${process.env.API_KEY!}`;

    const response = await fetch(videoUrlWithKey);
    if (!response.ok) {
        throw new Error(`فشل في جلب الفيديو: ${response.statusText}`);
    }
    const videoBlob = await response.blob();
    
    return videoBlob;

  } catch (error: any) {
    // Use the new helper function to generate a user-friendly message
    throw new Error(getApiErrorMessage(error));
  }
};