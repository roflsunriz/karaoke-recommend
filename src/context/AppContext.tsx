import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppState, AppAction, Song, DisplaySong, AppSettings } from '../types';
import { getAllSongs, saveSongs, mergeSongs, getSongsCount, getAllHistory, saveHistoryItem, deleteHistoryItem, clearAllHistory, saveSettings, loadSettings } from '../utils/indexedDB';
import type { MergeMode } from '../components/common/DataMergeModal';

// 初期状態
const initialState: AppState = {
  songs: [],
  filteredSongs: [],
  currentRecommendation: [],
  history: [],
  settings: {
    preventDuplicates: true,
    initialSource: 'all',
    displayCount: 1,
  },
  isDataLoaded: false,
};

// リデューサー関数
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_SONGS':
      return {
        ...state,
        songs: action.payload,
        filteredSongs: action.payload,
        isDataLoaded: true,
      };
    
    case 'SET_FILTERED_SONGS':
      return {
        ...state,
        filteredSongs: action.payload,
      };
    
    case 'SET_RECOMMENDATION':
      return {
        ...state,
        currentRecommendation: action.payload,
      };
    
    case 'LOAD_HISTORY':
      return {
        ...state,
        history: action.payload,
      };
    
    case 'ADD_TO_HISTORY': {
      const newHistoryItem = {
        id: Date.now().toString(),
        song: action.payload,
        recommendedAt: new Date(),
      };
      return {
        ...state,
        history: [newHistoryItem, ...state.history],
      };
    }
    
    case 'CLEAR_HISTORY':
      return {
        ...state,
        history: [],
      };
    
    case 'REMOVE_FROM_HISTORY':
      return {
        ...state,
        history: state.history.filter(item => item.id !== action.payload),
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    
    default:
      return state;
  }
}

// Context作成
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // ヘルパー関数
  loadSongs: (songs: Song[]) => void;
  loadSongsFromDB: () => Promise<void>;
  saveSongsToDB: (songs: Song[]) => Promise<void>;
  mergeSongsToDB: (songs: Song[], mode: MergeMode) => Promise<void>;
  checkExistingData: () => Promise<number>;
  loadHistoryFromDB: () => Promise<void>;
  addHistoryAndSave: (song: DisplaySong) => Promise<void>;
  removeHistoryAndSave: (historyId: string) => Promise<void>;
  clearHistoryAndSave: () => Promise<void>;
  loadSettingsFromDB: () => Promise<void>;
  updateSettingsAndSave: (settings: Partial<AppSettings>) => Promise<void>;
  getRandomRecommendation: () => Promise<DisplaySong[]>;
  convertToDisplaySong: (song: Song) => DisplaySong;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Context Provider
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // アプリ起動時にIndexedDBからデータを復元
  useEffect(() => {
    const initializeData = async () => {
      await loadSettingsFromDB();
      await loadSongsFromDB();
      await loadHistoryFromDB();
    };
    initializeData();
  }, []);

  // 曲データを読み込む（メモリのみ）
  const loadSongs = (songs: Song[]) => {
    dispatch({ type: 'LOAD_SONGS', payload: songs });
  };

  // IndexedDBから曲データを読み込む
  const loadSongsFromDB = async (): Promise<void> => {
    try {
      const songs = await getAllSongs();
      if (songs.length > 0) {
        dispatch({ type: 'LOAD_SONGS', payload: songs });
      }
    } catch (error) {
      console.error('データベースからの読み込みエラー:', error);
    }
  };

  // 曲データをIndexedDBに保存
  const saveSongsToDB = async (songs: Song[]): Promise<void> => {
    try {
      await saveSongs(songs);
      dispatch({ type: 'LOAD_SONGS', payload: songs });
    } catch (error) {
      console.error('データベースへの保存エラー:', error);
      throw error;
    }
  };

  // 曲データをマージしてIndexedDBに保存
  const mergeSongsToDB = async (songs: Song[], mode: MergeMode): Promise<void> => {
    try {
      if (mode === 'replace') {
        await saveSongs(songs);
        dispatch({ type: 'LOAD_SONGS', payload: songs });
      } else {
        await mergeSongs(songs, mode);
        const updatedSongs = await getAllSongs();
        dispatch({ type: 'LOAD_SONGS', payload: updatedSongs });
      }
    } catch (error) {
      console.error('データベースのマージエラー:', error);
      throw error;
    }
  };

  // 既存データの件数を確認
  const checkExistingData = async (): Promise<number> => {
    try {
      return await getSongsCount();
    } catch (error) {
      console.error('データ件数取得エラー:', error);
      return 0;
    }
  };

  // IndexedDBから履歴データを読み込む
  const loadHistoryFromDB = async (): Promise<void> => {
    try {
      const history = await getAllHistory();
      if (history.length > 0) {
        // 履歴をロード（個別にdispatchする代わりに一括で設定）
        dispatch({ type: 'LOAD_HISTORY', payload: history });
      }
    } catch (error) {
      console.error('履歴データベースからの読み込みエラー:', error);
    }
  };

  // 履歴を追加してIndexedDBに保存
  const addHistoryAndSave = async (song: DisplaySong): Promise<void> => {
    const newHistoryItem = {
      id: Date.now().toString(),
      song,
      recommendedAt: new Date(),
    };
    
    try {
      await saveHistoryItem(newHistoryItem);
      dispatch({ type: 'ADD_TO_HISTORY', payload: song });
    } catch (error) {
      console.error('履歴保存エラー:', error);
      // DBへの保存に失敗してもメモリには追加
      dispatch({ type: 'ADD_TO_HISTORY', payload: song });
    }
  };

  // 履歴を削除してIndexedDBからも削除
  const removeHistoryAndSave = async (historyId: string): Promise<void> => {
    try {
      await deleteHistoryItem(historyId);
      dispatch({ type: 'REMOVE_FROM_HISTORY', payload: historyId });
    } catch (error) {
      console.error('履歴削除エラー:', error);
      // DBからの削除に失敗してもメモリからは削除
      dispatch({ type: 'REMOVE_FROM_HISTORY', payload: historyId });
    }
  };

  // 全履歴を削除してIndexedDBからも削除
  const clearHistoryAndSave = async (): Promise<void> => {
    try {
      await clearAllHistory();
      dispatch({ type: 'CLEAR_HISTORY' });
    } catch (error) {
      console.error('履歴全削除エラー:', error);
      // DBからの削除に失敗してもメモリからは削除
      dispatch({ type: 'CLEAR_HISTORY' });
    }
  };

  // IndexedDBから設定データを読み込む
  const loadSettingsFromDB = async (): Promise<void> => {
    try {
      const settings = await loadSettings();
      if (settings) {
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
      }
    } catch (error) {
      console.error('設定データベースからの読み込みエラー:', error);
    }
  };

  // 設定を更新してIndexedDBに保存
  const updateSettingsAndSave = async (settings: Partial<AppSettings>): Promise<void> => {
    try {
      const newSettings = { ...state.settings, ...settings };
      await saveSettings(newSettings);
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    } catch (error) {
      console.error('設定保存エラー:', error);
      // DBへの保存に失敗してもメモリには更新
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    }
  };

  // SongをDisplaySongに変換
  const convertToDisplaySong = (song: Song): DisplaySong => ({
    id: song.trackUri,
    trackName: song.trackName,
    artistName: song.artistName,
    trackDuration: song.trackDuration,
    albumName: song.albumName,
  });

  // ランダムな曲を提案
  const getRandomRecommendation = async (): Promise<DisplaySong[]> => {
    if (state.filteredSongs.length === 0) return [];

    let availableSongs = state.filteredSongs;

    // 重複防止が有効な場合、履歴にある曲を除外
    if (state.settings.preventDuplicates) {
      const historyIds = state.history.map(h => h.song.id);
      availableSongs = state.filteredSongs.filter(song => 
        !historyIds.includes(song.trackUri)
      );
    }

    // 提案可能な曲がない場合
    if (availableSongs.length === 0) {
      return [];
    }

    // 設定に応じた提案数を決定
    const targetCount = Math.min(state.settings.displayCount, availableSongs.length);
    const recommendations: DisplaySong[] = [];
    const usedSongs = new Set<string>();

    // 指定された数の曲をランダム選択
    for (let i = 0; i < targetCount; i++) {
      const availableForSelection = availableSongs.filter(song => 
        !usedSongs.has(song.trackUri)
      );
      
      if (availableForSelection.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * availableForSelection.length);
      const selectedSong = availableForSelection[randomIndex];
      const displaySong = convertToDisplaySong(selectedSong);
      
      recommendations.push(displaySong);
      usedSongs.add(selectedSong.trackUri);
      
      // 履歴に追加（IndexedDBにも保存）
      await addHistoryAndSave(displaySong);
    }

    // 提案をセット
    dispatch({ type: 'SET_RECOMMENDATION', payload: recommendations });

    return recommendations;
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    loadSongs,
    loadSongsFromDB,
    saveSongsToDB,
    mergeSongsToDB,
    checkExistingData,
    loadHistoryFromDB,
    addHistoryAndSave,
    removeHistoryAndSave,
    clearHistoryAndSave,
    loadSettingsFromDB,
    updateSettingsAndSave,
    getRandomRecommendation,
    convertToDisplaySong,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Context使用用のカスタムフック
// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 