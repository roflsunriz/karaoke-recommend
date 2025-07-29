import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Icon from '../components/common/Icon';

const ListPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'trackName' | 'artistName' | 'albumName'>('trackName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // フィルタリングとソート
  const filteredAndSortedSongs = useMemo(() => {
    const filtered = state.songs.filter(song => 
      song.trackName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.albumName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aValue = a[sortBy].toLowerCase();
      const bValue = b[sortBy].toLowerCase();
      
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return filtered;
  }, [state.songs, searchTerm, sortBy, sortOrder]);

  // 全選択/全解除
  const handleSelectAll = () => {
    if (selectedSongs.size === filteredAndSortedSongs.length) {
      setSelectedSongs(new Set());
    } else {
      setSelectedSongs(new Set(filteredAndSortedSongs.map(song => song.trackUri)));
    }
  };

  // 個別選択
  const handleSelectSong = (trackUri: string) => {
    const newSelected = new Set(selectedSongs);
    if (newSelected.has(trackUri)) {
      newSelected.delete(trackUri);
    } else {
      newSelected.add(trackUri);
    }
    setSelectedSongs(newSelected);
  };

  // レコメンドページへの遷移
  const handleGoToRecommend = () => {
    if (selectedSongs.size > 0) {
      // 選択された曲のみをフィルタリング
      const selectedSongData = state.songs.filter(song => 
        selectedSongs.has(song.trackUri)
      );
      dispatch({ type: 'SET_FILTERED_SONGS', payload: selectedSongData });
    } else {
      // 何も選択されていない場合は全曲を対象
      dispatch({ type: 'SET_FILTERED_SONGS', payload: filteredAndSortedSongs });
    }
    navigate('/recommend');
  };

  // データが読み込まれていない場合の処理
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

  return (
    <div className="container mx-auto px-4 py-6">
      {/* ヘッダー */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          曲一覧 ({state.songs.length}曲)
        </h2>
        <p className="text-gray-600">
          レコメンド対象の曲を選択できます。何も選択しない場合は全曲が対象になります。
        </p>
      </div>

      {/* 検索とフィルタ */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 検索 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              曲名・アーティスト・アルバム検索
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="検索キーワードを入力..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* ソート項目 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ソート項目
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="trackName">曲名</option>
              <option value="artistName">アーティスト</option>
              <option value="albumName">アルバム</option>
            </select>
          </div>

          {/* ソート順 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ソート順
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">昇順</option>
              <option value="desc">降順</option>
            </select>
          </div>
        </div>
      </div>

      {/* 選択コントロール */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSelectAll}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {selectedSongs.size === filteredAndSortedSongs.length ? '全解除' : '全選択'}
          </button>
          <span className="text-sm text-gray-600">
            {selectedSongs.size}曲選択中 / 表示中{filteredAndSortedSongs.length}曲
          </span>
        </div>

        <button
          onClick={handleGoToRecommend}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <Icon name="music" color="inherit" size="small" />
          <span>レコメンドを開始</span>
        </button>
      </div>

      {/* 曲一覧テーブル */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  選択
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  曲名
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アーティスト
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アルバム
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  再生時間
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedSongs.map((song) => (
                <tr 
                  key={song.trackUri}
                  className={`hover:bg-gray-50 ${
                    selectedSongs.has(song.trackUri) ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedSongs.has(song.trackUri)}
                      onChange={() => handleSelectSong(song.trackUri)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {song.trackName}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {song.artistName}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {song.albumName}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {song.trackDuration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedSongs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            検索条件に一致する曲が見つかりません
          </div>
        )}
      </div>
    </div>
  );
};

export default ListPage; 