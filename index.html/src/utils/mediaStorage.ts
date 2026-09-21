// IndexedDB-backed media storage for user-uploaded MP3s and postcard images
// Persists user files across sessions directly on their mobile device or PC

const DB_NAME = 'vishuda_media_store';
const DB_VERSION = 1;
const AUDIO_STORE = 'custom_audios';
const IMAGE_STORE = 'custom_images';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(AUDIO_STORE)) {
        db.createObjectStore(AUDIO_STORE, { keyPath: 'soundId' });
      }
      if (!db.objectStoreNames.contains(IMAGE_STORE)) {
        db.createObjectStore(IMAGE_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface StoredAudioItem {
  soundId: string;
  blob: Blob;
  fileName: string;
  updatedAt: number;
}

export interface LoadedAudioRecord {
  url: string;
  fileName: string;
}

// Save an audio file (MP3, WAV, M4A) for a specific sound track
export async function saveAudioToStorage(
  soundId: string,
  file: File | Blob,
  fileName: string
): Promise<string> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(AUDIO_STORE, 'readwrite');
      const store = tx.objectStore(AUDIO_STORE);
      const item: StoredAudioItem = {
        soundId,
        blob: file,
        fileName,
        updatedAt: Date.now(),
      };
      const req = store.put(item);
      req.onsuccess = () => {
        const objectUrl = URL.createObjectURL(file);
        resolve(objectUrl);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not save audio to IndexedDB:', err);
    return URL.createObjectURL(file);
  }
}

// Load all saved custom audio tracks on startup
export async function loadAllAudiosFromStorage(): Promise<Record<string, LoadedAudioRecord>> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(AUDIO_STORE, 'readonly');
      const store = tx.objectStore(AUDIO_STORE);
      const req = store.getAll();

      req.onsuccess = () => {
        const items: StoredAudioItem[] = req.result || [];
        const map: Record<string, LoadedAudioRecord> = {};
        items.forEach((it) => {
          if (it.blob && it.soundId) {
            try {
              const url = URL.createObjectURL(it.blob);
              map[it.soundId] = {
                url,
                fileName: it.fileName || 'audio-personal.mp3',
              };
            } catch (e) {
              console.error('Failed to create object URL for stored audio:', e);
            }
          }
        });
        resolve(map);
      };

      req.onerror = () => resolve({});
    });
  } catch {
    return {};
  }
}

// Remove a custom audio track to restore synthetic sound
export async function removeAudioFromStorage(soundId: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(AUDIO_STORE, 'readwrite');
      const store = tx.objectStore(AUDIO_STORE);
      const req = store.delete(soundId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // ignore
  }
}

// Postcard custom background image storage
export async function savePostcardImage(dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IMAGE_STORE, 'readwrite');
      const store = tx.objectStore(IMAGE_STORE);
      const req = store.put({ id: 'current_postcard_bg', dataUrl, updatedAt: Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      localStorage.setItem('vishuda_custom_postcard_bg', dataUrl);
    } catch {
      // ignore
    }
  }
}

export async function loadPostcardImage(): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IMAGE_STORE, 'readonly');
      const store = tx.objectStore(IMAGE_STORE);
      const req = store.get('current_postcard_bg');
      req.onsuccess = () => {
        if (req.result && req.result.dataUrl) {
          resolve(req.result.dataUrl);
        } else {
          resolve(localStorage.getItem('vishuda_custom_postcard_bg'));
        }
      };
      req.onerror = () => resolve(localStorage.getItem('vishuda_custom_postcard_bg'));
    });
  } catch {
    return localStorage.getItem('vishuda_custom_postcard_bg');
  }
}

export async function removePostcardImage(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(IMAGE_STORE, 'readwrite');
    tx.objectStore(IMAGE_STORE).delete('current_postcard_bg');
  } catch {
    // ignore
  }
  try {
    localStorage.removeItem('vishuda_custom_postcard_bg');
  } catch {
    // ignore
  }
}
