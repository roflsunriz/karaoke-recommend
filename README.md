# 🎤 カラオケオートレコメンド

Skiley（Spotifyサードパーティサービス）のエクスポートデータを活用した、あなたにぴったりのカラオケ楽曲推薦アプリです。

## 🌟 概要

このアプリは、Skiley経由でエクスポートしたSpotifyリスニング履歴を分析し、カラオケで歌いやすい楽曲を自動的に推薦します。普段聞いている音楽の傾向から、カラオケで盛り上がる楽曲を見つけるお手伝いをします。

## 🚀 デモサイト

**[🎵 カラオケオートレコメンドを試す](https://roflsunriz.github.io/karaoke-recommend/)**

## ✨ 主な機能

- **📊 データインポート**: Skileyエクスポートデータの読み込み
- **🤖 自動推薦**: 聴取履歴に基づくカラオケ楽曲の推薦
- **📋 楽曲リスト**: 推薦された楽曲の一覧表示
- **📈 履歴管理**: 過去の推薦結果の確認
- **⚙️ 設定**: 推薦アルゴリズムのカスタマイズ

## 🛠️ 技術スタック

- **フロントエンド**: React 19 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS v4
- **ルーティング**: React Router v7
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
```

## 🎯 使用方法

1. **データ準備**: Skiley（Spotifyサードパーティサービス）を使ってSpotifyデータをエクスポート
2. **インポート**: エクスポートしたJSONファイルをアプリにアップロード
3. **推薦取得**: 自動推薦される楽曲を確認
4. **カラオケ**: 推薦された楽曲でカラオケを楽しむ！

### 📝 Skileyについて

Skileyは、Spotifyの聴取データを詳細に分析・エクスポートできるサードパーティサービスです。このアプリは、Skileyで出力されるJSONファイル形式のデータに対応しています。

## 📁 プロジェクト構造

```
src/
├── components/          # 再利用可能なコンポーネント
│   └── Layout/         # レイアウトコンポーネント
├── pages/              # ページコンポーネント
├── context/            # Reactコンテキスト
├── types/              # TypeScript型定義
└── assets/             # 静的アセット
```

## 🔧 開発

### スクリプト

```bash
npm run dev       # 開発サーバー起動
npm run build     # 本番ビルド
npm run preview   # ビルド結果のプレビュー
npm run lint      # ESLintでコードチェック
```

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

© roflsunriz - 2025 カラオケオートレコメンド

**🎵 Happy Karaoke! 🎵**
