# 調査知見

- ReactとReact DOMはpeer範囲内でも版が違うと実行時error #527で描画停止する。常に完全同一versionへ同時更新し、実renderer testと本番buildのブラウザー表示を確認する。
- `@mui/icons-material` と `@mui/material` は同じmajorへ同時更新する。片方だけでは `createSvgIcon` export不一致でbuildが失敗する。
- `eslint-plugin-react-hooks` v7のflat configは `configs.flat['recommended-latest']` を使う。新ruleはeffect順序やeffect内setStateの実装修正で満たし、ruleを無効化しない。
- TypeScript 7はtypescript-eslintのpeer範囲外なので対応まで6系を維持する。`bun audit fix` だけで残る間接依存はoverrideとlockfileを同時更新する。
- Pagesの公開経路はbranch出力でなくActions workflow。未commitのlocal成果物を配信せず、認証済みCLIでmainのdeploy workflowを起動する。
