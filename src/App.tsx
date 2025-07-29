/*!
 * © roflsunriz - 2025 カラオケオートレコメンド
 * メインアプリケーションコンポーネント
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ImportPage from './pages/ImportPage';
import ListPage from './pages/ListPage';
import RecommendPage from './pages/RecommendPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter basename="/karaoke-recommend">
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/import" element={<ImportPage />} />
              <Route path="/list" element={<ListPage />} />
              <Route path="/recommend" element={<RecommendPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              {/* デフォルトルート */}
              <Route path="/" element={<Navigate to="/import" replace />} />
              {/* 存在しないルートは import にリダイレクト */}
              <Route path="*" element={<Navigate to="/import" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
