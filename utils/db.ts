const DB_NAME = 'VEOVideoHistoryDB';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

export interface VideoHistoryItem {
  id?: number;
  prompt: string;
  duration: number;
  aspectRatio: string;
  timestamp: number;
  videoBlob: Blob;
}

let db: IDBDatabase;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("IndexedDB error:", request.error);
      reject("Error opening database.");
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

export const addVideoToDB = async (video: Omit<VideoHistoryItem, 'id'>): Promise<number> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(video);

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => {
        console.error("Error adding video to DB:", request.error);
        reject("Error adding video to database.");
    }
  });
};


export const getAllVideosFromDB = async (): Promise<VideoHistoryItem[]> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            // Sort by timestamp descending to show newest first
            resolve(request.result.sort((a, b) => b.timestamp - a.timestamp));
        };
        request.onerror = () => {
            console.error("Error fetching videos from DB:", request.error);
            reject("Error fetching videos from database.");
        }
    });
};

export const clearAllVideosFromDB = async (): Promise<void> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => {
            console.error("Error clearing DB:", request.error);
            reject("Error clearing video history.");
        }
    });
};
