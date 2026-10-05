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
