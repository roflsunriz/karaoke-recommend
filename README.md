# カラオケオートレコメンド

Skiley（Spotifyサードパーティサービス）のエクスポートデータから、カラオケで歌う曲をランダムに提案するアプリです。

## 概要

Skiley経由でエクスポートしたSpotifyの聴取データを読み込み、対象の楽曲から1曲または3曲をランダムに提案します。重複防止を有効にすると、提案済みの曲を候補から除外します。

## デモサイト

[カラオケオートレコメンドを試す](https://roflsunriz.github.io/karaoke-recommend/)

## 主な機能

### データインポート

- Skileyエクスポートデータの読み込み（ドラッグ&ドロップ対応）
- 3つのマージモード：完全置換、マージ1（既存データ保持）、マージ2（削除曲も反映）
- データ検証とエラーハンドリング

### 自動推薦

- ランダムレコメンド（1曲または3曲同時提案）
- 重複防止機能（既に提案済みの曲を除外）
- アニメーション効果付きの直感的なUI

### 楽曲リスト管理

- 全楽曲の一覧表示
- 曲名、アーティスト、アルバムで検索
- ソート機能（複数項目、昇順・降順）
- 楽曲選択機能（一括選択/個別選択）

### 履歴管理

- 推薦履歴の詳細表示
- 履歴のソート（新しい順、古い順、曲名、アーティスト順）
- 個別削除・全削除機能

### 詳細設定

- 重複防止設定の有効/無効切り替え
- 初期レコメンド対象の選択（全曲/未提案曲のみ）
- 提案表示件数の選択（1曲/3曲）
- データ管理機能

### データ永続化

- IndexedDBによるローカルストレージ
- オフライン動作対応
- 完全クライアントサイド（外部通信なし）

## 使用方法

1. **データ準備**: Skiley（Spotifyサードパーティサービス）を使ってSpotifyデータをエクスポート
2. **インポート**: エクスポートしたJSONファイルをアプリに読み込む
3. **設定**: 重複防止や提案表示件数を選ぶ
4. **推薦取得**: 自動推薦される楽曲を確認
5. **履歴管理**: 推薦履歴を確認・管理
6. **カラオケ**: 提案された楽曲をカラオケで歌う

### Skileyについて

Skileyは、Spotifyの聴取データを詳細に分析・エクスポートできるサードパーティサービスです。このアプリは、Skileyで出力されるJSONファイル形式のデータに対応しています。

## 技術スタック

詳細は [findings.md](findings.md#readme-1) に移しました。

## セットアップ

### 必要な環境

- Node.js 20.19以降の20系、または22.12以降（[Viteの要件](https://vite.dev/guide/#scaffolding-your-first-vite-project)）
- Bun（`package.json`の`packageManager`に記載した版）

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/roflsunriz/karaoke-recommend.git
cd karaoke-recommend

# 依存関係をインストール
bun install

# 開発サーバーを起動
bun run dev
```

### ビルド

```bash
# 本番用ビルド
bun run build

# プレビュー
bun run preview

# GitHub Pagesにmainのコミットをデプロイ
bun run deploy
```

`bun run deploy` はローカルのビルド確認後、認証済みGitHub CLIを使って既存のGitHub Pages workflowを `main` 指定で起動します。公開したい変更は先にmainへ取り込みます。ローカルの未コミット変更は公開されません。実行結果の確認方法は [更新手順](how-to-update.md) を参照してください。

## プロジェクト構造

詳細は [findings.md](findings.md#readme-2) に移しました。

## 開発

詳細は [findings.md](findings.md#readme-3) に移しました。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 開発者

[@roflsunriz](https://github.com/roflsunriz)

---

© roflsunriz - 2025 カラオケオートレコメンド - v1.5.0

## 依存更新の自動処理

詳細は [findings.md](findings.md#readme-4) に移しました。
