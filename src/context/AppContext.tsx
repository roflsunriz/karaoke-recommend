import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { AppState, AppAction, Song, DisplaySong } from '../types';

// 初期状態
const initialState: AppState = {
  songs: [],
  filteredSongs: [],
  currentRecommendation: null,
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
  getRandomRecommendation: () => DisplaySong | null;
  convertToDisplaySong: (song: Song) => DisplaySong;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Context Provider
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 曲データを読み込む
  const loadSongs = (songs: Song[]) => {
    dispatch({ type: 'LOAD_SONGS', payload: songs });
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
  const getRandomRecommendation = (): DisplaySong | null => {
    if (state.filteredSongs.length === 0) return null;

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
      return null;
    }

    // ランダム選択
    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    const selectedSong = availableSongs[randomIndex];
    const displaySong = convertToDisplaySong(selectedSong);

    // 提案を履歴に追加
    dispatch({ type: 'SET_RECOMMENDATION', payload: displaySong });
    dispatch({ type: 'ADD_TO_HISTORY', payload: displaySong });

    return displaySong;
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    loadSongs,
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