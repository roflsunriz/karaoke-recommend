import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Icon from '../components/common/Icon';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  // 設定の更新
  const updateSetting = <K extends keyof typeof state.settings>(
    key: K,
    value: typeof state.settings[K]
  ) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { [key]: value }
    });
    
    // 保存メッセージを表示
    setShowSaveMessage(true);
    setTimeout(() => {
      setShowSaveMessage(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          アプリケーション設定
        </h2>
        <p className="text-gray-600">
          カラオケレコメンドの動作をカスタマイズできます。
        </p>
      </div>

      {/* 保存メッセージ */}
      {showSaveMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="check" color="success" size="small" />
            <span className="text-green-700">設定を保存しました！</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* レコメンド設定 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Icon name="music" color="primary" size="small" />
            <span>レコメンド設定</span>
          </h3>

          {/* 重複防止設定 */}
          <div className="mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex items-center h-5">
                <input
                  id="prevent-duplicates"
                  type="checkbox"
                  checked={state.settings.preventDuplicates}
                  onChange={(e) => updateSetting('preventDuplicates', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="prevent-duplicates" className="text-sm font-medium text-gray-900">
                  重複防止を有効にする
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  有効にすると、既に提案済みの曲は再度提案されません。
                  無効にすると、同じ曲が何度でも提案される可能性があります。
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  現在の状態: 
                  <span className={`ml-1 font-medium ${state.settings.preventDuplicates ? 'text-green-600' : 'text-orange-600'}`}>
                    {state.settings.preventDuplicates ? '有効' : '無効'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 初期対象設定 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              初期レコメンド対象
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="initial-all"
                  type="radio"
                  value="all"
                  checked={state.settings.initialSource === 'all'}
                  onChange={(e) => updateSetting('initialSource', e.target.value as 'all' | 'unproposed')}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="initial-all" className="ml-2 text-sm text-gray-900">
                  全曲から選択
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="initial-unproposed"
                  type="radio"
                  value="unproposed"
                  checked={state.settings.initialSource === 'unproposed'}
                  onChange={(e) => updateSetting('initialSource', e.target.value as 'all' | 'unproposed')}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="initial-unproposed" className="ml-2 text-sm text-gray-900">
                  未提案曲のみから選択
                </label>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              アプリ起動時やデータ読み込み時の初期設定です。
            </p>
          </div>

          {/* 表示件数設定 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              提案表示件数
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="display-1"
                  type="radio"
                  value={1}
                  checked={state.settings.displayCount === 1}
                  onChange={(e) => updateSetting('displayCount', parseInt(e.target.value) as 1 | 3)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="display-1" className="ml-2 text-sm text-gray-900">
                  1曲ずつ提案（推奨）
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="display-3"
                  type="radio"
                  value={3}
                  checked={state.settings.displayCount === 3}
                  onChange={(e) => updateSetting('displayCount', parseInt(e.target.value) as 1 | 3)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="display-3" className="ml-2 text-sm text-gray-900">
                  3曲同時提案
                </label>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              一度に提案する曲数を選択できます。
            </p>
          </div>
        </div>

        {/* データ管理 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Icon name="chart" color="info" size="small" />
            <span>データ管理</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 現在のデータ状況 */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">現在のデータ状況</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">総曲数:</span>
                  <span className="font-medium">{state.songs.length}曲</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">提案履歴:</span>
                  <span className="font-medium">{state.history.length}件</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">データ読み込み状況:</span>
                  <span className={`font-medium ${state.isDataLoaded ? 'text-green-600' : 'text-red-600'}`}>
                    {state.isDataLoaded ? '読み込み済み' : '未読み込み'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">進捗率:</span>
                  <span className="font-medium">
                    {state.songs.length > 0 
                      ? Math.round((state.history.length / state.songs.length) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* クイックアクション */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">クイックアクション</h4>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/import')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Icon name="folder" color="inherit" size="small" />
                  <span>新しいデータを読み込み</span>
                </button>
                <button
                  onClick={() => navigate('/history')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Icon name="history" color="inherit" size="small" />
                  <span>履歴を管理</span>
                </button>
                <button
                  onClick={() => navigate('/recommend')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Icon name="music" color="inherit" size="small" />
                  <span>レコメンドを開始</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* アプリケーション情報 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Icon name="info" color="info" size="small" />
            <span>アプリケーション情報</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">機能概要</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• SKiley JSONデータの読み込み</li>
                <li>• ランダム曲提案（重複防止対応）</li>
                <li>• 提案履歴の管理</li>
                <li>• 曲一覧の検索・フィルタ</li>
                <li>• レスポンシブデザイン</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">プライバシー・セキュリティ</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 完全クライアントサイド動作</li>
                <li>• データの外部送信なし</li>
                <li>• ローカルストレージのみ使用</li>
                <li>• オフライン動作対応</li>
                <li>• セキュアな処理</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              © 2025 roflsunriz - カラオケオートレコメンド - v1.0.0
            </p>
          </div>
        </div>
      </div>

      {/* 戻るボタン */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/recommend')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center space-x-2"
        >
          <Icon name="back" color="inherit" size="small" />
          <span>レコメンドページに戻る</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsPage; 