# KD Help Book documentation registry

Official Cloudflare registry for the `khb-authoring` and `khb-publishing`
volumes published by [`KDHelpBook/monorepo`](https://github.com/KDHelpBook/monorepo).

The Worker and its R2 bucket are generated from
[`KDHelpBook/cf-registry-template`](https://github.com/KDHelpBook/cf-registry-template).
Instance layout and GitHub OIDC permissions live in `khb-registry.yml`.

## Development

```sh
npm ci
npm run check
npm run dev
```

Cloudflare Workers Builds deploys `main` only. Pull requests run validation,
typecheck, and build in GitHub Actions without receiving access to production
R2. Static documentation PR previews remain in the monorepo and are unrelated
to this registry.
