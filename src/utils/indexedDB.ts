import type { Song, RecommendHistory } from '../types';

const DB_NAME = 'KaraokeRecommendDB';
const DB_VERSION = 2; // バージョンアップして履歴ストア追加
const SONGS_STORE = 'songs';
const HISTORY_STORE = 'history';

// IndexedDBを初期化
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('IndexedDBの初期化に失敗しました'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // 曲データストア
      if (!db.objectStoreNames.contains(SONGS_STORE)) {
        const songsStore = db.createObjectStore(SONGS_STORE, { 
          keyPath: 'trackUri' 
        });
        
        // インデックスを作成（検索用）
        songsStore.createIndex('trackName', 'trackName', { unique: false });
        songsStore.createIndex('artistName', 'artistName', { unique: false });
        songsStore.createIndex('albumName', 'albumName', { unique: false });
      }

      // 履歴データストア
      if (!db.objectStoreNames.contains(HISTORY_STORE)) {
        const historyStore = db.createObjectStore(HISTORY_STORE, { 
          keyPath: 'id' 
        });
        
        // インデックスを作成
        historyStore.createIndex('recommendedAt', 'recommendedAt', { unique: false });
        historyStore.createIndex('trackName', 'song.trackName', { unique: false });
        historyStore.createIndex('artistName', 'song.artistName', { unique: false });
      }
    };
  });
};

// 全ての曲データを取得
export const getAllSongs = async (): Promise<Song[]> => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SONGS_STORE], 'readonly');
      const store = transaction.objectStore(SONGS_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(new Error('データの取得に失敗しました'));
      };
    });
  } catch (error) {
    console.error('getAllSongs error:', error);
    return [];
  }
};

// 曲データを保存（配列）
export const saveSongs = async (songs: Song[]): Promise<void> => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SONGS_STORE], 'readwrite');
      const store = transaction.objectStore(SONGS_STORE);

      // 既存データをすべてクリアしてから新しいデータを保存
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        // 新しいデータを追加
        let completed = 0;
        const total = songs.length;
        
        if (total === 0) {
          resolve();
          return;
        }

        songs.forEach((song) => {
          const addRequest = store.add(song);
          
          addRequest.onsuccess = () => {
            completed++;
            if (completed === total) {
              resolve();
            }
          };
          
          addRequest.onerror = () => {
            reject(new Error(`曲データの保存に失敗しました: ${song.trackName}`));
          };
        });
      };

      clearRequest.onerror = () => {
        reject(new Error('既存データのクリアに失敗しました'));
      };
    });
  } catch (error) {
    console.error('saveSongs error:', error);
    throw error;
  }
};

// 曲データをマージ保存（重複チェック付き）
export const mergeSongs = async (newSongs: Song[], mode: 'merge1' | 'merge2'): Promise<void> => {
  try {
    const existingSongs = await getAllSongs();
    
    // 既存曲のMapを作成（trackUriをキーとして）
    const existingMap = new Map<string, Song>();
    existingSongs.forEach(song => {
      existingMap.set(song.trackUri, song);
    });

    // 新しく来た曲のMapを作成
    const newSongsMap = new Map<string, Song>();
    newSongs.forEach(song => {
      newSongsMap.set(song.trackUri, song);
    });

    let finalSongs: Song[] = [];

    if (mode === 'merge1') {
      // マージ1: 新規は追加、重複なし、削除曲はそのままにする
      finalSongs = [...existingSongs];
      
      // 新しい曲を追加（重複チェック）
      newSongs.forEach(newSong => {
        if (!existingMap.has(newSong.trackUri)) {
          finalSongs.push(newSong);
        }
      });
    } else if (mode === 'merge2') {
      // マージ2: 新規は追加、重複なし、削除曲はDBから削除
      finalSongs = [];
      
      // 新しい曲リストにある既存曲のみを残す
      existingSongs.forEach(existingSong => {
        if (newSongsMap.has(existingSong.trackUri)) {
          finalSongs.push(existingSong);
        }
      });
      
      // 新しい曲を追加（重複チェック）
      newSongs.forEach(newSong => {
        if (!existingMap.has(newSong.trackUri)) {
          finalSongs.push(newSong);
        }
      });
    }

    // 最終的なデータを保存
    await saveSongs(finalSongs);
  } catch (error) {
    console.error('mergeSongs error:', error);
    throw error;
  }
};

// データベースを完全にクリア
export const clearAllData = async (): Promise<void> => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SONGS_STORE], 'readwrite');
      const store = transaction.objectStore(SONGS_STORE);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('データのクリアに失敗しました'));
      };
    });
  } catch (error) {
    console.error('clearAllData error:', error);
    throw error;
  }
};

// データ件数を取得
export const getSongsCount = async (): Promise<number> => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SONGS_STORE], 'readonly');
      const store = transaction.objectStore(SONGS_STORE);
      const request = store.count();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('データ件数の取得に失敗しました'));
      };
    });
  } catch (error) {
    console.error('getSongsCount error:', error);
    return 0;
  }
};

// === 履歴データ管理関数 ===

// 全ての履歴データを取得
export const getAllHistory = async (): Promise<RecommendHistory[]> => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([HISTORY_STORE], 'readonly');
      const store = transaction.objectStore(HISTORY_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        // dateオブジェクトに変換
        const history = (request.result || []).map(item => ({
          ...item,
          recommendedAt: new Date(item.recommendedAt)
        }));
        resolve(history);
      };

      request.onerror = () => {
        reject(new Error('履歴データの取得に失敗しました'));
      };
    });
  } catch (error) {
    console.error('getAllHistory error:', error);
    return [];
  }
};

// 履歴データを保存（1件）
export const saveHistoryItem = async (history: RecommendHistory): Promise<void> => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([HISTORY_STORE], 'readwrite');
      const store = transaction.objectStore(HISTORY_STORE);
      
      // Dateオブジェクトを文字列に変換して保存
      const historyToSave = {
        ...history,
        recommendedAt: history.recommendedAt.toISOString()
      };
      
      const request = store.put(historyToSave);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('履歴データの保存に失敗しました'));
      };
    });
  } catch (error) {
    console.error('saveHistoryItem error:', error);
    throw error;
  }
};

// 履歴データを削除（1件）
export const deleteHistoryItem = async (historyId: string): Promise<void> => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([HISTORY_STORE], 'readwrite');
      const store = transaction.objectStore(HISTORY_STORE);
      const request = store.delete(historyId);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('履歴データの削除に失敗しました'));
      };
    });
  } catch (error) {
    console.error('deleteHistoryItem error:', error);
    throw error;
  }
};

// 全履歴データを削除
export const clearAllHistory = async (): Promise<void> => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([HISTORY_STORE], 'readwrite');
      const store = transaction.objectStore(HISTORY_STORE);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('履歴データのクリアに失敗しました'));
      };
    });
  } catch (error) {
    console.error('clearAllHistory error:', error);
    throw error;
  }
};

// 履歴件数を取得
export const getHistoryCount = async (): Promise<number> => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([HISTORY_STORE], 'readonly');
      const store = transaction.objectStore(HISTORY_STORE);
      const request = store.count();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('履歴件数の取得に失敗しました'));
      };
    });
  } catch (error) {
    console.error('getHistoryCount error:', error);
    return 0;
  }
}; 