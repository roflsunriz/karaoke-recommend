import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Icon from '../components/common/Icon';

const RecommendPage = () => {
  const navigate = useNavigate();
  const { state, getRandomRecommendation } = useApp();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNoSongsMessage, setShowNoSongsMessage] = useState(false);

  // 新しい提案を取得
  const handleNewRecommendation = useCallback(async () => {
    setIsAnimating(true);
    setShowNoSongsMessage(false);
    
    setTimeout(async () => {
      const newRecommendation = await getRandomRecommendation();
      if (newRecommendation.length === 0) {
        setShowNoSongsMessage(true);
      }
      setIsAnimating(false);
    }, 1000);
  }, [getRandomRecommendation]);

  // 初回提案の自動実行
  useEffect(() => {
    if (state.currentRecommendation.length === 0 && state.filteredSongs.length > 0 && state.isDataLoaded) {
      handleNewRecommendation();
    }
  }, [state.filteredSongs.length, state.isDataLoaded, state.currentRecommendation, handleNewRecommendation]);

  // 提案可能な曲数を計算
  const availableCount = state.settings.preventDuplicates 
    ? state.filteredSongs.length - state.history.length
    : state.filteredSongs.length;

  // データが読み込まれていない場合
  if (!state.isDataLoaded) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="mb-4 flex justify-center">
            <Icon name="warning" color="warning" size="large" />
          </div>
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">
            データが読み込まれていません
          </h2>
          <p className="text-yellow-700 mb-4">
            先にJSONファイルをインポートしてください。
          </p>
          <button
            onClick={() => navigate('/import')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            インポートページへ
          </button>
        </div>
      </div>
    );
  }

  // 対象曲がない場合
  if (state.filteredSongs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="mb-4 flex justify-center">
            <Icon name="music" color="warning" size="large" />
          </div>
          <h2 className="text-xl font-semibold text-orange-800 mb-2">
            対象となる曲がありません
          </h2>
          <p className="text-orange-700 mb-4">
            曲一覧から提案対象の曲を選択してください。
          </p>
          <button
            onClick={() => navigate('/list')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            曲一覧へ戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <Icon name="mic" color="primary" size="medium" />
          次に歌う曲はこちら！
        </h2>
        <p className="text-gray-600">
          {state.filteredSongs.length}曲から選択 
          {state.settings.preventDuplicates && (
            <span className="text-sm text-gray-500 ml-2">
              (重複除外: 残り{availableCount}曲)
            </span>
          )}
        </p>
      </div>

      {/* メインカード */}
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden mb-8">
        {isAnimating ? (
          // ローディングアニメーション
          <div className="p-12 text-center">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="animate-spin rounded-full w-8 h-8 border-b-2 border-purple-600"></div>
              <span className="text-lg font-medium text-gray-700">選曲中...</span>
            </div>
            <div className="text-gray-500 flex items-center justify-center gap-2">
              素敵な曲を探しています
              <Icon name="music" color="info" size="small" />
            </div>
          </div>
        ) : showNoSongsMessage ? (
          // 提案可能な曲がない場合
          <div className="p-12 text-center">
            <div className="mb-4 flex justify-center">
              <Icon name="sad" color="info" className="text-6xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              提案できる曲がありません
            </h3>
            <p className="text-gray-600 mb-6">
              {state.settings.preventDuplicates 
                ? "重複防止が有効で、全ての曲が提案済みです。設定で重複防止を無効にするか、履歴をクリアしてください。"
                : "対象となる曲がありません。"
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/history')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
              >
                履歴を確認
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
              >
                設定を変更
              </button>
            </div>
          </div>
        ) : state.currentRecommendation.length > 0 ? (
          // 提案された曲の表示
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="mb-4 flex justify-center">
                <Icon name="music" color="primary" className="text-6xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {state.settings.displayCount === 1 ? '今回の提案曲' : '今回の提案曲（3曲）'}
              </h3>
            </div>

            {/* 複数曲表示 */}
            <div className={`grid gap-6 mb-8 ${
              state.currentRecommendation.length === 1 
                ? 'grid-cols-1' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {state.currentRecommendation.map((song, index) => (
                <div key={song.id} className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                  <div className="mb-3 flex justify-center">
                    <Icon 
                      name={state.currentRecommendation.length === 1 ? 'mic' : 'music'} 
                      color="secondary" 
                      size="large" 
                    />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {song.trackName}
                  </h4>
                  <p className="text-lg text-gray-600 mb-1 line-clamp-1">
                    {song.artistName}
                  </p>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                    {song.albumName}
                  </p>
                                      <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
                      <Icon name="time" color="info" size="small" />
                      <span>{song.trackDuration}</span>
                    </div>
                  {state.currentRecommendation.length > 1 && (
                    <div className="mt-3">
                      <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                        #{index + 1}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* アクションボタン */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleNewRecommendation}
                disabled={availableCount <= state.settings.displayCount && state.settings.preventDuplicates}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Icon name="dice" color="inherit" size="small" />
                <span>再抽選</span>
              </button>
              <button
                onClick={() => navigate('/list')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Icon name="list" color="inherit" size="small" />
                <span>曲一覧へ戻る</span>
              </button>
            </div>
          </div>
        ) : (
          // 初期状態
          <div className="p-12 text-center">
            <div className="mb-4 flex justify-center">
              <Icon name="mic" color="primary" className="text-6xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              準備完了！
            </h3>
            <button
              onClick={handleNewRecommendation}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto"
            >
              <Icon name="music" color="inherit" size="small" />
              <span>曲を提案してもらう</span>
            </button>
          </div>
        )}
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {state.filteredSongs.length}
          </div>
          <div className="text-sm text-blue-700">対象曲数</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {state.history.length}
          </div>
          <div className="text-sm text-green-700">提案履歴</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {availableCount}
          </div>
          <div className="text-sm text-purple-700">残り候補</div>
        </div>
      </div>

      {/* クイックアクション */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">クイックアクション</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/history')}
            className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Icon name="history" color="inherit" size="small" />
            <span className="text-sm">履歴を見る</span>
          </button>
          <button
            onClick={() => navigate('/list')}
            className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Icon name="list" color="inherit" size="small" />
            <span className="text-sm">曲一覧</span>
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Icon name="settings" color="inherit" size="small" />
            <span className="text-sm">設定</span>
          </button>
          <button
            onClick={() => navigate('/import')}
            className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Icon name="folder" color="inherit" size="small" />
            <span className="text-sm">新しいデータ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendPage; 