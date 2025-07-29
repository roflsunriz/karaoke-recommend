import React from 'react';
import Icon from './Icon';

export type MergeMode = 'replace' | 'merge1' | 'merge2';

interface DataMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (mode: MergeMode) => void;
  existingCount: number;
  newCount: number;
}

const DataMergeModal: React.FC<DataMergeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  existingCount,
  newCount,
}) => {
  if (!isOpen) return null;

  const handleConfirm = (mode: MergeMode) => {
    onConfirm(mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Icon name="warning" color="warning" size="medium" />
            <h2 className="text-2xl font-bold text-gray-800">
              データの処理方法を選択
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="close" size="small" />
          </button>
        </div>

        {/* 現在の状況 */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="info" color="info" size="small" />
            <span className="font-semibold text-blue-800">現在の状況</span>
          </div>
          <div className="text-blue-700 space-y-1">
            <p>• データベースに保存されている曲数: <strong>{existingCount}曲</strong></p>
            <p>• 新しくアップロードされた曲数: <strong>{newCount}曲</strong></p>
          </div>
        </div>

        {/* 選択肢 */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            どのように処理しますか？
          </h3>

          {/* 完全置き換え */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
            <button
              onClick={() => handleConfirm('replace')}
              className="w-full text-left"
            >
              <div className="flex items-start gap-3">
                                 <div className="mt-1">
                   <Icon name="refresh" color="error" size="small" />
                 </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">
                    完全に置き換える
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    既存のデータをすべて削除して、新しいデータで完全に置き換えます。
                  </p>
                  <div className="text-xs text-gray-500">
                    結果: {newCount}曲になります
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* マージ1 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
            <button
              onClick={() => handleConfirm('merge1')}
              className="w-full text-left"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Icon name="plus" color="success" size="small" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">
                    マージ1: 既存データを保持
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    既存のデータはそのまま残し、新しいデータの中で重複していない曲のみを追加します。
                    削除された曲はデータベースに残ります。
                  </p>
                  <div className="text-xs text-gray-500">
                    結果: 最大{existingCount + newCount}曲になります（重複を除く）
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* マージ2 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <button
              onClick={() => handleConfirm('merge2')}
              className="w-full text-left"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Icon name="sync" color="primary" size="small" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">
                    マージ2: 削除曲も反映
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    新しいデータと同期します。新しいデータにない曲はデータベースからも削除され、
                    新しい曲は追加されます。
                  </p>
                  <div className="text-xs text-gray-500">
                    結果: {newCount}曲になります（既存データの一部は削除される可能性があります）
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* フッター */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataMergeModal; 