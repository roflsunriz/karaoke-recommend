# 変更履歴

このプロジェクトの主な変更はこのファイルに記録します。

書式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に基づきます。

## [Unreleased]

### Fixed

- 公開画面がReactの版不一致で起動しない問題を解消するため、ReactとReact DOMを同じ19.3.0へ同期して固定し、DOM型も同系列へ更新した。
- build成功だけでは検出できないレンダラー初期化失敗を再発防止するため、インストール済みReact/DOMを使った実描画テストをCIへ追加した。

### Security

- brace-expansion の既知DoSを解消するため、既存 override を5.0.12へ更新し、Bunのlockを再生成した。
- 修正版がない braces の経路を除き公開機能を維持するため、手動deployを既存のGitHub Pages workflowへ統一し、gh-pages依存を外した。

### Fixed

- CI と Dependabot の分類の実行順が前後しても更新を取りこぼさないよう、同じ PR 番号と head SHA を再照合する経路を追加した。

### Security

- 既知の脆弱性を解消するため、上流依存が旧版へ固定する brace-expansion を安全な patch 版へ更新し、Bun のロックファイルを再生成した。
- push前監査で検出された既知の依存脆弱性を解消するため、安全版へ依存関係とロックファイルを更新した。

### Changed


- 不具合・機能提案などの受付とPRの記入形式を揃え、プロジェクト固有の確認項目を残した。 READMEは既存の意味と手順を保ち、実装と異なる説明や読みにくい表現を修正した。

- 依存更新を安全に省力化するため、Dependabot の patch／minor PR を既存 CI の全チェック成功後に自動取り込みし、失敗ジョブを一度再実行する設定を追加した。
- 作業開始時の共通指針見落としを防ぐため、調査やコマンド実行より前に `COMMON-AGENTS.md` を先頭から末尾まで読み、EOFを確認する必須ゲートを追加した。
