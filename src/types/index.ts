// SKiley Export JSON データの型定義
export interface Song {
  addedAt: string;
  addedBy: string;
  albumArtistsNames: string;
  albumName: string;
  albumPopularity: number;
  albumRecordLabel: string;
  albumReleaseDate: string;
  albumType: string;
  albumUpc: string;
  albumUri: string;
  albumUrl: string;
  artistFollowers: number;
  artistGenres: string;
  artistName: string;
  artistPopularity: number;
  artistUri: string;
  artistUrl: string;
  isLikedByUser: boolean;
  isLocal: string;
  secondaryArtistsNames: string;
  trackDuration: string;
  trackFeatureAcousticness: number;
  trackFeatureDanceability: number;
  trackFeatureEnergy: number;
  trackFeatureInstrumentalness: number;
  trackFeatureKey: number;
  trackFeatureLiveness: number;
  trackFeatureLoudness: number;
  trackFeatureMode: number;
  trackFeatureSpeechiness: number;
  trackFeatureTempo: number;
  trackFeatureTimeSignature: number;
  trackFeatureValence: number;
  trackIsrc: string;
  trackName: string;
  trackNumber: number;
  trackPopularity: number;
  trackUri: string;
  trackUrl: string;
}

// 表示用の簡易Song型
export interface DisplaySong {
  id: string; // trackUri を使用
  trackName: string;
  artistName: string;
  trackDuration: string;
  albumName: string;
}

// 提案履歴の型
export interface RecommendHistory {
  id: string;
  song: DisplaySong;
  recommendedAt: Date;
}

// アプリケーション設定の型
export interface AppSettings {
  preventDuplicates: boolean;
  initialSource: 'all' | 'unproposed';
  displayCount: 1 | 3;
}

// アプリケーションの状態管理用型
export interface AppState {
  songs: Song[];
  filteredSongs: Song[];
  currentRecommendation: DisplaySong | null;
  history: RecommendHistory[];
  settings: AppSettings;
  isDataLoaded: boolean;
}

// アクション型
export type AppAction =
  | { type: 'LOAD_SONGS'; payload: Song[] }
  | { type: 'SET_FILTERED_SONGS'; payload: Song[] }
  | { type: 'SET_RECOMMENDATION'; payload: DisplaySong }
  | { type: 'ADD_TO_HISTORY'; payload: DisplaySong }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'REMOVE_FROM_HISTORY'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }; 