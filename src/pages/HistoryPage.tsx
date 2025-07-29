import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Icon from '../components/common/Icon';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { state, removeHistoryAndSave, clearHistoryAndSave } = useApp();
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'trackName' | 'artistName'>('newest');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

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

  // ソート済み履歴
  const sortedHistory = [...state.history].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.recommendedAt).getTime() - new Date(a.recommendedAt).getTime();
      case 'oldest':
        return new Date(a.recommendedAt).getTime() - new Date(b.recommendedAt).getTime();
      case 'trackName':
        return a.song.trackName.localeCompare(b.song.trackName);
      case 'artistName':
        return a.song.artistName.localeCompare(b.song.artistName);
      default:
        return 0;
    }
  });

  // 個別削除処理
  const handleDeleteItem = (id: string) => {
    setItemToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await removeHistoryAndSave(itemToDelete);
    }
    setShowConfirmModal(false);
    setItemToDelete(null);
  };

  // 全削除処理
  const handleClearAll = () => {
    setItemToDelete('all');
    setShowConfirmModal(true);
  };

  const confirmClearAll = async () => {
    await clearHistoryAndSave();
    setShowConfirmModal(false);
    setItemToDelete(null);
  };

  // 日時フォーマット
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* ヘッダー */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          提案履歴 ({state.history.length}件)
        </h2>
        <p className="text-gray-600">
          これまでに提案された曲の履歴を確認・管理できます。
        </p>
      </div>

      {state.history.length === 0 ? (
        // 履歴がない場合
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="mb-4 flex justify-center">
              <Icon name="history" color="info" size="large" className="text-6xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              まだ履歴がありません
            </h3>
            <p className="text-gray-600 mb-6">
              曲を提案してもらうと、ここに履歴が表示されます。
            </p>
            <button
              onClick={() => navigate('/recommend')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto"
            >
              <Icon name="music" color="inherit" size="small" />
              <span>曲を提案してもらう</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* コントロール */}
          <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* ソート */}
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700">
                  並び順:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="newest">提案日時（新しい順）</option>
                  <option value="oldest">提案日時（古い順）</option>
                  <option value="trackName">曲名（あいうえお順）</option>
                  <option value="artistName">アーティスト名（あいうえお順）</option>
                </select>
              </div>

              {/* アクション */}
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate('/recommend')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                >
                  <Icon name="music" color="inherit" size="small" />
                  <span>新しい提案</span>
                </button>
                <button
                  onClick={handleClearAll}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                >
                  <Icon name="delete" color="inherit" size="small" />
                  <span>全削除</span>
                </button>
              </div>
            </div>
          </div>

          {/* 履歴リスト */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="divide-y divide-gray-200">
              {sortedHistory.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <Icon name="music" color="primary" size="medium" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {item.song.trackName}
                          </h3>
                          <p className="text-gray-600 truncate">
                            {item.song.artistName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Icon name="album" color="info" size="small" />
                          {item.song.albumName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="time" color="info" size="small" />
                          {item.song.trackDuration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="calendar" color="info" size="small" />
                          {formatDate(item.recommendedAt)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                      title="この履歴を削除"
                    >
                      <Icon name="delete" color="error" size="small" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 統計情報 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {state.history.length}
              </div>
              <div className="text-sm text-blue-700">総提案数</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {new Set(state.history.map(h => h.song.artistName)).size}
              </div>
              <div className="text-sm text-green-700">アーティスト数</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {state.history.length > 0 
                  ? Math.round((state.history.length / state.songs.length) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-purple-700">進捗率</div>
            </div>
          </div>
        </>
      )}

      {/* 確認モーダル */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center mb-4">
              <div className="mb-2 flex justify-center">
                <Icon name="warning" color="warning" size="large" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {itemToDelete === 'all' ? '全履歴を削除' : '履歴を削除'}
              </h3>
              <p className="text-gray-600">
                {itemToDelete === 'all' 
                  ? 'すべての提案履歴を削除しますか？この操作は取り消せません。'
                  : 'この履歴を削除しますか？この操作は取り消せません。'
                }
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                キャンセル
              </button>
              <button
                onClick={itemToDelete === 'all' ? confirmClearAll : confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage; 