# 更新手順

## Dependabot PR の更新

前提は `.github/dependabot.yml` と PR 用 CI（CI）です。更新 PR の head SHA と `gh pr checks <PR番号>` の結果を確認してください。patch／minor は全チェック成功後に自動取り込みされます。初回 CI 失敗は failed jobs のみを 1 回再実行し、再失敗時は指定した lockfile を再生成し、CI を再実行します。

設定を変えたときは `actionlint .github/workflows/dependabot-automation.yml` と実際の PR の Actions 結果を確認します。問題があれば呼び出し先の共通 workflow SHA を直前の検証済み値へ戻すコミットを push します。取り込まれた依存更新に問題があれば通常の revert コミットで復旧します。

## 依存脆弱性の更新

`package.json` の `overrides` は、上流パッケージが brace-expansion の旧版を固定している間に安全な patch 版を選ぶために使う。上流が安全版を採用したら override を減らせるか確認する。更新時は `bun install --lockfile-only --ignore-scripts`、`bun install --frozen-lockfile`、`bun audit` を実行し、該当する lint・型・テスト・ビルドを確認する。問題があれば更新コミットを revert し、lockfile と package.json を同じ版へ戻す。

CI 完了より Dependabot の分類が遅れる場合は、`callback_workflow_file` が指す呼び出し側 workflow を `workflow_dispatch` し、同じ PR 番号・head SHA・全チェックを再確認する。呼び出し側のファイル名を変える際はこの入力も一緒に更新する。

## 手動でGitHub Pagesを再公開する

GitHub Pagesはbranch配信ではなく既存のActions workflowで公開する。前提はBun、GitHub CLI、認証済みアカウントとActions実行権限、公開対象のmainへの取り込み。`bun run deploy` はローカルbuildを検証し、`gh workflow run deploy.yml --repo roflsunriz/karaoke-recommend --ref main` を起動する。ローカルの未commit成果物を配信する機能ではない。

```powershell
bun run deploy
gh run list --repo roflsunriz/karaoke-recommend --workflow deploy.yml --branch main --event workflow_dispatch --limit 5 --json databaseId,headSha,status,conclusion,url
# 上の結果で今回の実行IDと公開対象SHAを確認してから実行する
gh run watch <実行ID> --repo roflsunriz/karaoke-recommend --exit-status
```

成功後はPagesの公開URLと更新内容を確認する。失敗時はその実行ログを読み、原因を修正して同じworkflowを再実行する。公開済み内容の復旧は問題のコミットを通常revertし、mainのCIとPages公開の成功を確認する。

## ReactとReact DOMの更新

ReactとReact DOMは完全に同じversionを同時に選び、package.jsonとbun.lockを同じコミットで更新する。peer rangeやbuild成功だけでは起動時の完全一致を保証しない。`bun install --frozen-lockfile`、`bun audit`、`bun run lint`、`bun run type-check`、`bun run test`、`bun run build`を確認し、`bun run preview`の本番画面でも初期表示と各ページへの移動を確認する。main取り込み後は品質CIとPages公開を待ち、公開画面を再確認する。復旧は両依存とlockを同時に戻す通常revertを使う。
