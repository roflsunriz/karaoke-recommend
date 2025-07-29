# 要件定義書：ローカルJSONによるカラオケ曲レコメンドアプリ

## 1. プロジェクト概要
- **目的**：SKileyエクスポートのJSONデータを読み込み、ランダムに次のカラオケ曲を提案するシンプルなWebアプリを作成するのじゃ。
- **ゴール**：
  1. JSONファイルをブラウザ上でインポートし、データを正しく読み込む。
  2. 読み込んだ曲リストからランダムに1曲を提案する。
  3. 必要に応じて重複防止オプションを提供する。
  4. 直感的なUIで提案結果を表示する。

## 2. 対象データ
- **データ形式**：SKileyからエクスポートしたJSONファイル
- **想定スキーマ**（各曲オブジェクト）：
  ```json
  {
    "addedAt": "2025-06-19T12:48:43Z",
    "addedBy": "Keith",
    "albumArtistsNames": "James Blunt",
    "albumName": "Back to Bedlam",
    "albumPopularity": 73,
    "albumRecordLabel": "Custard/Atlantic",
    "albumReleaseDate": "2005-08-08",
    "albumType": "album",
    "albumUpc": "075679345165",
    "albumUri": "spotify:album:1ekaxA9Q5GzUPCepx4wzMF",
    "albumUrl": "https://open.spotify.com/album/1ekaxA9Q5GzUPCepx4wzMF",
    "artistFollowers": 3233151,
    "artistGenres": "",
    "artistName": "James Blunt",
    "artistPopularity": 74,
    "artistUri": "spotify:artist:7KMqksf0UMdyA0UCf4R3ux",
    "artistUrl": "https://open.spotify.com/artist/7KMqksf0UMdyA0UCf4R3ux",
    "isLikedByUser": true,
    "isLocal": "stream",
    "secondaryArtistsNames": "",
    "trackDuration": "03:29",
    "trackFeatureAcousticness": 0.633,
    "trackFeatureDanceability": 0.675,
    "trackFeatureEnergy": 0.479,
    "trackFeatureInstrumentalness": 0.0000176,
    "trackFeatureKey": 0,
    "trackFeatureLiveness": 0.088,
    "trackFeatureLoudness": -9.87,
    "trackFeatureMode": 0,
    "trackFeatureSpeechiness": 0.0278,
    "trackFeatureTempo": 81.998,
    "trackFeatureTimeSignature": 4,
    "trackFeatureValence": 0.454,
    "trackIsrc": "USAT20401588",
    "trackName": "You're Beautiful",
    "trackNumber": 2,
    "trackPopularity": 80,
    "trackUri": "spotify:track:0vg4WnUWvze6pBOJDTq99k",
    "trackUrl": "https://open.spotify.com/track/0vg4WnUWvze6pBOJDTq99k"
  }
  ```

* **必須フィールド**： `trackName`, `artistName`, `trackDuration` など、UI表示用に必要な主要フィールドを確保すること。

## 3. 主な機能

1. **JSONファイル読み込み**

   * ファイル選択ダイアログからローカルJSONをインポート
   * スキーマ検証（必須キーの存在チェック）
2. **曲リストの表示**

   * インポートした曲一覧をテーブルまたはカードで表示
   * 曲名、アーティスト名、再生時間を一覧表示
3. **ランダムレコメンド**

   * 「次に歌う曲を提案」ボタンでランダムに1曲を抽出
   * **重複防止**：既に提案済の曲を除外するオプション（オン／オフ）
4. **履歴管理**

   * 提案履歴の一覧表示
   * 履歴リセット機能
5. **UI/UX要件**

   * モバイル／デスクトップ対応のレスポンシブデザイン
   * 軽量で高速な動作

## 4. 非機能要件

* **対応ブラウザ**：最新のChrome, Firefox, Safari, Edge
* **アーキテクチャ**：完全クライアントサイド、サーバレス
* **パフォーマンス**：JSON読み込み〜レコメンドまで1秒以内
* **セキュリティ**：ローカルデータのみ扱い、外部通信なし
* **技術スタック（例）**：

  * フレームワーク：React or Vue
  * スタイリング：Tailwind CSS
  * テスト：Jest

## 5. 開発・運用体制

* **言語**：JavaScript / TypeScript
* **バージョン管理**：GitHub
* **デプロイ**：GitHub Pages または Vercel

## 6. 拡張案

* ジャンル／アーティストでフィルタ
* あいまい検索機能
* クラウド同期による複数デバイス対応
* 提案精度向上のための簡易レコメンド導入

---

