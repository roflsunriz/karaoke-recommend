# findings.md

karaoke-recommend の実現手段、共通指針の適用条件と調査知見の正本。作業前に全文読む。利用者向けの導入・使用方法はREADME、更新の手順はhow-to-update.md、実施結果と未検証事項はverification.mdを参照する。移した記述の確認日・条件・留保は元のまま保持し、文書移動を再実測と解釈しない。

## 共通指針の適用条件と代替検証

- 対象の共通ルール: 設計と実装方針／検証／依存関係の変更
- 理由: 既存ReactアプリはBunを使用し、ReactとReact DOMは実行時に完全に同一versionが必要。TypeScript更新にはtypescript-eslintのpeer範囲制約がある。
- 適用範囲: 依存更新、ビルド、React描画とPages公開
- 同等の品質を保つ手段・検証: package.json/bun.lockの同時更新、lint・型・build・実レンダラーtest・監査と本番画面表示を確認する。版制約と再確認条件は以下の実測記録に従う。

新たな免除や操作許可を追加するものではない。AGENTS.mdの禁止・承認条件と共通指針は引き続き有効。

<a id="agents-1"></a>

## パッケージ管理

- パッケージマネージャは Bun を使用する。

移動元: `AGENTS.md`。

<a id="agents-2"></a>

## 依存監査で確定した事項（2026-09-23）

- `bun audit fix` だけでは brace-expansion の脆弱版が上流の厳密な依存範囲で残る。`package.json` の既存 `overrides` と `bun.lock` を同時に更新し、`bun audit` と関連テスト・ビルドで確認する。上流が安全版を取り込んだ場合は override の必要性を再評価する。

移動元: `AGENTS.md`。

<a id="agents-3"></a>

## Dependabot更新で確定した事項（2026-09-23）

- `eslint-plugin-react-hooks` v7は `eslint.config.js` で `configs.flat['recommended-latest']` を使う。旧形式 `configs['recommended-latest']` のままでは flat configのplugins形式エラーになる。新ルール `react-hooks/immutability` 対策として `src/context/AppContext.tsx` の初期化effectはヘルパー宣言より後に置く。新ルール `react-hooks/set-state-in-effect` 対策として `src/pages/RecommendPage.tsx` の初回自動提案は `setTimeout` へ委譲する。検証は `bun run lint`、`bun run type-check`、`bun run build`。
- `@mui/icons-material` 9は peerで `@mui/material` ^9を要求する。片方だけ上げると `createSvgIcon` 未exportでビルドが失敗する。`package.json` の両方を同時に更新し、`bun install` で `bun.lock` を再生成して `bun run build` で確認する。
- Dependabot PRが最新mainより遅れている場合はPRブランチへ `origin/main` を取り込み、`bun install` で競合後のlockfileを再生成してから修正・検証する。リモートがDependabotのforce-updateで進んでいた場合は `origin/<branch>` から作り直し、必要な修正差分だけ載せ替えてpushする。

移動元: `AGENTS.md`。

<a id="agents-4"></a>

## TypeScript更新の制約（2026-10-11）

- `typescript-eslint` 8.71.1の公式npmメタデータにあるTypeScript peer範囲は `>=4.8.4 <6.1.0`。TypeScript 7はこの範囲外のため、対応版が出るまでは6.0.3を使用し、更新時にpeer範囲とlint・型・buildを再確認する。

移動元: `AGENTS.md`。

<a id="agents-5"></a>

## CI監査修復の注意

- 2026-10-05: Pages APIのbuild_typeはworkflow、sourceはmain。旧gh-pagesのbranch出力は実際の公開経路ではなかった。bun run deployは認証済みGitHub CLIでdeploy.ymlをmain指定で起動する。未commitのローカル成果物は配信しない。braces3.0.3はGHSA-vfj7-8cjw-p6xmの修正版がなく、gh-pages→globby→fast-glob→micromatch経路を除去した。

移動元: `AGENTS.md`。

<a id="agents-6"></a>

## Reactの実行時互換性

- 2026-10-05: React19.3.0/React DOM19.2.8はpeer rangeを満たして監査・型・buildも通るが、公開画面の起動時にReact error #527で描画が停止した。公式https://react.dev/errors/527の通り両者は完全に同一versionでなければならない。依存更新は両者を同時に行い、bun run testで実レンダラーの初期化と描画、ブラウザで本番buildの画面表示を確認する。

移動元: `AGENTS.md`。

<a id="readme-1"></a>

## 技術スタック

- **フロントエンド**: React 19 + TypeScript
- **ビルドツール**: Vite
- **UI Components**: Material-UI + Tailwind CSS v4
- **ルーティング**: React Router v8
- **データ管理**: IndexedDB
- **状態管理**: React Context + useReducer
- **ホスティング**: GitHub Pages

移動元: `README.md`。

<a id="readme-2"></a>

## プロジェクト構造

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

移動元: `README.md`。

<a id="readme-3"></a>

## 開発

### スクリプト

```bash
bun run dev       # 開発サーバー起動
bun run build     # 本番ビルド
bun run preview   # ビルド結果のプレビュー
bun run lint      # ESLintでコードチェック
bun run test      # インストール済みReact/DOMの描画互換性を確認
bun run deploy    # GitHub Pagesにデプロイ
```

### 主要な機能実装

- **状態管理**: React Context + useReducer による統一された状態管理
- **データ永続化**: IndexedDBに楽曲データと履歴を保存
- **マージ機能**: 完全置換・既存データ保持・削除曲の反映から選択
- **検索・フィルタ**: リアルタイム検索とソート機能
- **レスポンシブ**: モバイル・デスクトップ完全対応

### コントリビューション

1. このリポジトリをフォーク
2. feature ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Request を作成

移動元: `README.md`。

<a id="readme-4"></a>

## 依存更新の自動処理

Dependabot は対象の依存関係を毎週確認します。patch／minor 更新は PR のチェック（CI）が成功した後に自動で squash merge されます。CI の失敗ジョブは 1 回だけ再実行します。再失敗時は指定した lockfile を再生成し、CI を再実行します。major 更新は手動で確認します。マージ後はデプロイ workflow を明示起動します。

移動元: `README.md`。

<a id="update-1"></a>

## Dependabot PR の更新

前提は `.github/dependabot.yml` と PR 用 CI（CI）です。更新 PR の head SHA と `gh pr checks <PR番号>` の結果を確認してください。patch／minor は全チェック成功後に自動取り込みされます。初回 CI 失敗は failed jobs のみを 1 回再実行し、再失敗時は指定した lockfile を再生成し、CI を再実行します。

設定を変えたときは `actionlint .github/workflows/dependabot-automation.yml` と実際の PR の Actions 結果を確認します。問題があれば呼び出し先の共通 workflow SHA を直前の検証済み値へ戻すコミットを push します。取り込まれた依存更新に問題があれば通常の revert コミットで復旧します。

移動元: `how-to-update.md`。

<a id="verification-1"></a>

## Dependabot 自動処理（2026-09-23）

`.github/workflows/dependabot-automation.yml` を actionlint で検査し、PR 用 workflow 名（CI）と一致することを確認する。Dependabot の patch／minor かつ全 PR チェック成功の場合だけ取り込み、major・古い SHA・再失敗は残す。

実際の Dependabot PR がまだない場合、動作経路は未検証として扱う。実 PR 発生後に自動化ジョブ、CI の再試行、マージ結果を確認する。

移動元: `verification.md`。

## 関連文書

- [利用者向けREADME](README.md)
- [更新と復旧](how-to-update.md)
- [検証結果と未検証範囲](verification.md)
- [変更履歴](CHANGELOG.md)
