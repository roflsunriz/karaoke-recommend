# 検証手順

## Dependabot 自動処理（2026-09-23）

`.github/workflows/dependabot-automation.yml` を actionlint で検査し、PR 用 workflow 名（CI）と一致することを確認する。Dependabot の patch／minor かつ全 PR チェック成功の場合だけ取り込み、major・古い SHA・再失敗は残す。

実際の Dependabot PR がまだない場合、動作経路は未検証として扱う。実 PR 発生後に自動化ジョブ、CI の再試行、マージ結果を確認する。

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
