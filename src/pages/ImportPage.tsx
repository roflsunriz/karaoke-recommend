import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Icon from '../components/common/Icon';
import DataMergeModal, { type MergeMode } from '../components/common/DataMergeModal';
import type { Song } from '../types';

const ImportPage = () => {
  const navigate = useNavigate();
  const { saveSongsToDB, mergeSongsToDB, checkExistingData } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // モーダル関連の状態
  const [showModal, setShowModal] = useState(false);
  const [pendingSongs, setPendingSongs] = useState<Song[]>([]);
  const [existingCount, setExistingCount] = useState(0);

  // モーダルでの選択処理
  const handleModeSelect = async (mode: MergeMode) => {
    setLoading(true);
    setError(null);
    
    try {
      if (mode === 'replace') {
        await saveSongsToDB(pendingSongs);
        setSuccess(`${pendingSongs.length}曲のデータで完全に置き換えました！`);
      } else {
        await mergeSongsToDB(pendingSongs, mode);
        const modeText = mode === 'merge1' ? 'マージ1（既存データ保持）' : 'マージ2（削除曲も反映）';
        setSuccess(`${modeText}でデータをマージしました！`);
      }
      
      // 2秒後にListPageに遷移
      setTimeout(() => {
        navigate('/list');
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'データの保存に失敗しました');
    } finally {
      setLoading(false);
      setPendingSongs([]);
    }
  };

  // ファイル読み込み処理
  const handleFileLoad = async (file: File) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // 配列かどうかチェック
      if (!Array.isArray(data)) {
        throw new Error('JSONファイルは配列形式である必要があります');
      }

      // 最低限必要なフィールドがあるかチェック
      const requiredFields = ['trackName', 'artistName', 'trackDuration', 'trackUri'];
      const isValidData = data.every((item: unknown) => 
        typeof item === 'object' && item !== null &&
        requiredFields.every(field => field in item)
      );

      if (!isValidData) {
        throw new Error('必要なフィールド（trackName, artistName, trackDuration, trackUri）が不足しています');
      }

      const newSongs = data as Song[];
      
      // 既存データをチェック
      const existingDataCount = await checkExistingData();
      
      if (existingDataCount > 0) {
        // 既存データがある場合はモーダルを表示
        setExistingCount(existingDataCount);
        setPendingSongs(newSongs);
        setShowModal(true);
      } else {
        // 既存データがない場合は直接保存
        await saveSongsToDB(newSongs);
        setSuccess(`${newSongs.length}曲のデータを正常に読み込みました！`);
        
        // 2秒後にListPageに遷移
        setTimeout(() => {
          navigate('/list');
        }, 2000);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'ファイルの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // ファイル選択処理
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileLoad(file);
    }
  };

  // ドラッグ&ドロップ処理
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/json') {
      handleFileLoad(file);
    } else {
      setError('JSONファイルを選択してください');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          SKiley JSONデータをインポート
        </h2>
        <p className="text-gray-600">
          SKileyからエクスポートしたJSONファイルをアップロードして、
          カラオケ曲のデータベースを作成します。
        </p>
      </div>

      {/* ファイルアップロード領域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
                      <div className="flex justify-center mb-4">
              <Icon name="folder" color="info" className="text-6xl" />
            </div>
          <div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              JSONファイルをドラッグ&ドロップ
            </p>
            <p className="text-gray-500 mb-4">または</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              ファイルを選択
            </button>
          </div>
        </div>
      </div>

      {/* 隠しファイル入力 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* ローディング表示 */}
      {loading && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full w-4 h-4 border-b-2 border-blue-600"></div>
            <span className="text-blue-700">ファイルを処理中...</span>
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-red-600">❌</span>
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* 成功表示 */}
      {success && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="check" color="success" size="small" />
            <span className="text-green-700">{success}</span>
          </div>
          <p className="text-green-600 mt-2 text-sm">
            まもなく曲一覧ページに移動します...
          </p>
        </div>
      )}

      {/* 使用方法 */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Icon name="list" color="primary" size="small" />
              使用方法
            </h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>SKileyアプリからプレイリストをJSONファイルとしてエクスポート</li>
          <li>エクスポートしたJSONファイルをここにアップロード</li>
          <li>データの検証が完了したら自動的に曲一覧ページに移動</li>
          <li>ランダムレコメンド機能をお楽しみください！</li>
        </ol>
      </div>

      {/* データマージモーダル */}
      <DataMergeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleModeSelect}
        existingCount={existingCount}
        newCount={pendingSongs.length}
      />
    </div>
  );
};

export default ImportPage; 