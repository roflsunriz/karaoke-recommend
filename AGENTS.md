# AGENTS.md

## 作業開始前の必須手順（最優先・例外なし）

1. エージェントは、調査、計画、コマンド実行、スキル利用、ファイル編集、コミット、プッシュを始める前に、必ずリポジトリ直下の `.\COMMON-AGENTS.md` を開き、先頭から末尾まで全文を読む。
2. `COMMON-AGENTS.md` はGit管理外のシンボリックリンクである。`git`や既定のignore設定が有効な`rg --files`の検索結果だけで、ファイルが存在しないと判断してはならない。PowerShellでは最初に次を実行する。

```powershell
Get-Content -Raw -LiteralPath .\COMMON-AGENTS.md
```

3. 読み取りに失敗した場合、出力が省略された場合、または末尾まで読めたことを確認できない場合は、一切の作業を開始せず、パスとシンボリックリンク先を確認して全文を再取得する。必要なら分割して末尾まで読む。
4. 全文を読了するまで、ローカル `AGENTS.md` だけを根拠に作業を続けてはならない。読了後は `COMMON-AGENTS.md` を最優先の指針とし、読了直後の最初の進捗報告で全文を読了したことを明示する。
   このファイルでは `karaoke-recommend` 固有の補足だけを記載する。

## パッケージ管理

- パッケージマネージャは Bun を使用する。

## 依存監査で確定した事項（2026-09-23）

- `bun audit fix` だけでは brace-expansion の脆弱版が上流の厳密な依存範囲で残る。`package.json` の既存 `overrides` と `bun.lock` を同時に更新し、`bun audit` と関連テスト・ビルドで確認する。上流が安全版を取り込んだ場合は override の必要性を再評価する。

## Dependabot更新で確定した事項（2026-09-23）

- `eslint-plugin-react-hooks` v7は `eslint.config.js` で `configs.flat['recommended-latest']` を使う。旧形式 `configs['recommended-latest']` のままでは flat configのplugins形式エラーになる。新ルール `react-hooks/immutability` 対策として `src/context/AppContext.tsx` の初期化effectはヘルパー宣言より後に置く。新ルール `react-hooks/set-state-in-effect` 対策として `src/pages/RecommendPage.tsx` の初回自動提案は `setTimeout` へ委譲する。検証は `bun run lint`、`bun run type-check`、`bun run build`。
- `@mui/icons-material` 9は peerで `@mui/material` ^9を要求する。片方だけ上げると `createSvgIcon` 未exportでビルドが失敗する。`package.json` の両方を同時に更新し、`bun install` で `bun.lock` を再生成して `bun run build` で確認する。
- Dependabot PRが最新mainより遅れている場合はPRブランチへ `origin/main` を取り込み、`bun install` で競合後のlockfileを再生成してから修正・検証する。リモートがDependabotのforce-updateで進んでいた場合は `origin/<branch>` から作り直し、必要な修正差分だけ載せ替えてpushする。
