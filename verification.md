# 検証手順

## 2026-10-31: Dependabot PR #33 の依存監査

- Zodとminimatchを修正版に更新し、CIと同じBun 1.3.8で固定インストール、監査0件、lint、型検査、Reactレンダラーテスト、本番buildが成功した。
- 分離したローカルpreviewをアプリ内ブラウザーで開き、インポート画面と設定画面の表示を確認した。公開後の画面は別途確認する。

## 2026-10-11: Dependabot PR の監査失敗

PR #20〜#24 のCIは、`source-map-js` 1.2.1に対するGHSA-68fv-2mgg-jv7qの検出で停止した。mainのlockfileを1.2.2へ更新し、`bun install --frozen-lockfile`、`bun audit`（0件）、lint、型チェック、実レンダラーテスト、buildの成功を確認した。PRを更新した後も、各PRのCI結果とマージ後のmainのCIを確認する。

PR #24ではmainの更新を取り込んでlockfileを再生成し、TypeScript 6.0.3で同じ検証が成功した。`typescript-eslint` 8.71.1のnpm peer範囲はTypeScript `<6.1.0`であり、現時点の7.0.2は対象外。マージ後はPRのCIとmainのCIを確認する。

PR #20〜#24はすべてCI成功後にmainへマージされた。追加の依存更新では、MUI両パッケージ、React Router、Vite、ESLint関連、PostCSSを更新し、Bun 1.4.0の固定インストール、監査0件、lint、型、実レンダラーテスト、buildが成功した。最終更新コミット`2cb709e`のmain CIとPages公開workflowは成功した。分離Chromeとローカルpreviewの接続が確立できず、更新後のブラウザ操作と公開画面の表示は未検証。

## Dependabot 自動処理（2026-09-23）

詳細は [findings.md](findings.md#verification-1) に移しました。

## 依存脆弱性の確認（2026-09-23）

監査では brace-expansion を含む推移依存の旧版が検出された。Bun 1.4.0 で lockfile の固定インストールと再監査を行い、既知脆弱性 0 件を確認した。lint・型・ビルド成功。

大量の Dependabot PR により CI 完了より分類が遅れる場合でも、分類後の `workflow_dispatch` が現在の PR 番号と head SHA を照合して再評価する。別の作成者、古い SHA、未完了の CI はマージしない。

## 2026-10-05: GitHub受付・READMEの整備（公開前）

- 比較元: `7f53666723496da41972e8b23ade95fcc9ce009e`（`main`）。
- 受付フォーム 2 件のYAML構造、重複キー・ID、入力型、選択肢、予約ファイル名を一括検査し、エラー0件。
- 既存の固有質問・入力例・必須条件を原文と照合。READMEのリンク・画像・コマンド・条件を確認し、裏付けがある誤記だけを訂正した。
- 既存のCI、Dependabot、labeler、ライセンスのファイル内容は比較元から変更していない。
- 製品のビルド・インストール・実機操作、GitHub上のフォーム表示、公開後CIは今回の静的検証に含めない。公開後に実際の受付表示と必要ラベルの適用を確認する。

## 2026-10-05: 公開後の依存監査修復

- 元の受付整備PRはマージ済みだが、同じmainのCIでは依存監査が失敗していた。既存CIや監査条件は変えず、依存定義とlockを修復した。
- 公式npm registryとGitHub Advisory Databaseで修正版と依存範囲を確認した。brace-expansion 5.0.12を採用し、固定lockと全依存監査（0件）、lint・型・ビルドを検証する。
- Pages APIでbuild_type=workflow、source.branch=mainを確認し、既存deploy.ymlのworkflow_dispatchと本番build・artifact・Pages公開stepsを照合した。通常のmain pushで同workflowが起動する。手動deployのdispatch後も対象SHAと実行結果を確認する（how-to-update.md参照）。
- bracesは2026-10-05時点でpatched versions=None、npm latest=3.0.3。監査抑制せずgh-pages経路を既存Actions公開へ置換した。
- ローカル結果: CIと同じBun（1.3.8）で固定lockとbun audit成功（既知脆弱性0件）。lint、型検査、本番build成功。単体テストscriptは本repoでは定義されていない。

## 2026-10-05: 公開画面のReact実行時修復

- main7651420の品質CI・Pages公開・手動dispatch・HTTPとartifact比較は成功したが、分離Chromeでrootの描画0件、React error #527（React19.3.0/React DOM19.2.8）を再現した。CI成功を画面成功と扱わない。
- ReactとReact DOMを19.3.0へそろえて固定し、DOM型も19.3系列へ更新した。公式の完全一致条件はhttps://react.dev/errors/527を参照。
- bun run testは実際にインストールしたReact DOMのサーバーレンダラーを初期化・描画する。旧不一致の組み合わせではレンダラー初期化で失敗すること、新組み合わせで成功することを確認する。
- CI同版Bun1.3.8の固定lock・全依存監査・lint・型・test・buildと、ローカル本番preview/公開PagesのChrome描画を検証する。既存の監査・build・公開チェックは維持する。
- ローカル結果: 全監査0件、lint・型・実レンダラーテスト・本番build成功。旧19.3.0/19.2.8の隔離fixtureでは同テストがIncompatible React versionsで失敗し、修復版は成功した。本番previewのChromeで初期表示と5ページ（list/recommend/history/settings/import）のリンク移動・描画が成功、実行時例外0件。CI YAMLはテストstep追加以外に既存条件・steps・権限の変更なしと構造比較した。

## 2026-10-16: findings.mdへの知見分離

- 目的: 共通指針に合わせ、AGENTSの行動指示と利用者向けREADMEから、開発内部の実現手段・例外の条件・再利用する調査知見をfindings.mdへ分離した。移動した本文の条件・確認日・未検証の留保を保持した。
- 元文書との本文照合、Markdownの相対リンク・見出しアンカーの検査、git diff --checkを実施し、新たなリンク不整合と空白エラーは0件。AGENTSの一般的な指示は内容を保って再編し、findings全文必読・禁止と承認条件を確認した。
- GitHubの既存Dependabot警告を読み取り、Open PRも確認した（作業開始時Open PR 0件、Open警告 0件）。GitHubの警告なしを全依存の安全保証や実機動作の検証とは扱わない。
- ローカルの依存監査は既知の脆弱性0件で通過した。outdatedによる更新候補も読み取り確認し、TypeScript解析器の非互換制約と無関係な版更新を区別した。
- 文書移動と参照整理では製品の実行時ロジックを変更していない。実機書換え、認証操作、外部サービスへの投稿・署名・リリースは実施せず、これらの動作が再検証済みであるとは扱わない。

## 2026-10-20: Dependabot 月末一括処理

- `.github/dependabot.yml` は毎月28日00:00、`.github/workflows/dependabot-automation.yml` は同日18:00（いずれも `Asia/Tokyo`）に設定した。呼び出し先は検証済み共通 workflow の固定 SHA とし、現在の head SHA、Dependabot の資格状態、全 PR チェック成功を merge 前に再確認する。
- YAML 構文、変更差分、空白エラーをローカルで検査した。実際の月末 schedule と Dependabot PR の merge 経路は、次回の毎月28日実行で確認する。
