# 🎤 カラオケオートレコメンド

Skiley（Spotifyサードパーティサービス）のエクスポートデータを活用した、あなたにぴったりのカラオケ楽曲推薦アプリです。

## 🌟 概要

このアプリは、Skiley経由でエクスポートしたSpotifyリスニング履歴を分析し、カラオケで歌いやすい楽曲を自動的に推薦します。普段聞いている音楽の傾向から、カラオケで盛り上がる楽曲を見つけるお手伝いをします。

## 🚀 デモサイト

**[🎵 カラオケオートレコメンドを試す](https://roflsunriz.github.io/karaoke-recommend/)**

## ✨ 主な機能

### 📊 データインポート
- Skileyエクスポートデータの読み込み（ドラッグ&ドロップ対応）
- 3つのマージモード：完全置換、マージ1（既存データ保持）、マージ2（削除曲も反映）
- データ検証とエラーハンドリング

### 🤖 自動推薦
- ランダムレコメンド（1曲または3曲同時提案）
- 重複防止機能（既に提案済みの曲を除外）
- アニメーション効果付きの直感的なUI

### 📋 楽曲リスト管理
- 全楽曲の一覧表示
- 高度な検索機能（曲名、アーティスト、アルバム）
- ソート機能（複数項目、昇順・降順）
- 楽曲選択機能（一括選択/個別選択）

### 📈 履歴管理
- 推薦履歴の詳細表示
- 履歴のソート（新しい順、古い順、曲名、アーティスト順）
- 個別削除・全削除機能

### ⚙️ 詳細設定
- 重複防止設定の有効/無効切り替え
- 初期レコメンド対象の選択（全曲/未提案曲のみ）
- 提案表示件数の選択（1曲/3曲）
- データ管理機能

### 💾 データ永続化
- IndexedDBによるローカルストレージ
- オフライン動作対応
- 完全クライアントサイド（外部通信なし）

## 🛠️ 技術スタック

- **フロントエンド**: React 19 + TypeScript
- **ビルドツール**: Vite
- **UI Components**: Material-UI + Tailwind CSS v4
- **ルーティング**: React Router v7
- **データ管理**: IndexedDB
- **状態管理**: React Context + useReducer
- **ホスティング**: GitHub Pages

## 📦 セットアップ

### 必要な環境
- Node.js 20以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/roflsunriz/karaoke-recommend.git
cd karaoke-recommend

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### ビルド

```bash
# 本番用ビルド
npm run build

# プレビュー
npm run preview

# GitHub Pagesにデプロイ
npm run deploy
```

## 🎯 使用方法

1. **データ準備**: Skiley（Spotifyサードパーティサービス）を使ってSpotifyデータをエクスポート
2. **インポート**: エクスポートしたJSONファイルをアプリにアップロード
3. **設定**: 推薦設定をお好みにカスタマイズ
4. **推薦取得**: 自動推薦される楽曲を確認
5. **履歴管理**: 推薦履歴を確認・管理
6. **カラオケ**: 推薦された楽曲でカラオケを楽しむ！

### 📝 Skileyについて

Skileyは、Spotifyの聴取データを詳細に分析・エクスポートできるサードパーティサービスです。このアプリは、Skileyで出力されるJSONファイル形式のデータに対応しています。

## 📁 プロジェクト構造

```
src/
├── components/          # 再利用可能なコンポーネント
│   ├── common/         # 共通UI部品（Icon、モーダル等）
│   └── Layout/         # レイアウトコンポーネント
├── pages/              # ページコンポーネント
│   ├── ImportPage.tsx  # データインポート
│   ├── ListPage.tsx    # 楽曲一覧
│   ├── RecommendPage.tsx # 推薦機能
│   ├── HistoryPage.tsx # 履歴管理
│   └── SettingsPage.tsx # 設定
├── context/            # React Context（状態管理）
├── types/              # TypeScript型定義
├── utils/              # ユーティリティ関数
│   └── indexedDB.ts    # データベース操作
└── assets/             # 静的アセット
```

## 🔧 開発

### スクリプト

```bash
npm run dev       # 開発サーバー起動
npm run build     # 本番ビルド
npm run preview   # ビルド結果のプレビュー
npm run lint      # ESLintでコードチェック
npm run deploy    # GitHub Pagesにデプロイ
```

### 主要な機能実装

- **状態管理**: React Context + useReducer による統一された状態管理
- **データ永続化**: IndexedDBによる高速・大容量ローカルストレージ
- **マージ機能**: 3つのマージモードによる柔軟なデータ統合
- **検索・フィルタ**: リアルタイム検索とソート機能
- **レスポンシブ**: モバイル・デスクトップ完全対応

### コントリビューション

1. このリポジトリをフォーク
2. feature ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Request を作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 👨‍💻 開発者

[@roflsunriz](https://github.com/roflsunriz)

---

© roflsunriz - 2025 カラオケオートレコメンド - v1.5.0

**🎵 Happy Karaoke! 🎵**
