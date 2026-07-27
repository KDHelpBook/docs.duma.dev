# KD Help Book Cloudflare registry

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/KDHelpBook/cf-registry-template)

Your own KD Help Book registry: a Cloudflare Worker, a private R2 bucket, the
web viewer, and secretless publishing from GitHub Actions.

## Deploy

1. Click **Deploy to Cloudflare** and choose your Cloudflare and GitHub
   accounts.
2. Keep the production branch set to `main`. Do not enable non-production
   branch deployments; registry pull requests are checked by GitHub Actions
   without receiving access to R2.
3. Wait for Cloudflare to create the Worker and R2 bucket.
4. Open the generated `*.workers.dev` URL.

Cloudflare automatically deploys every change merged to `main`. No Cloudflare
API token is stored in GitHub.

## Configure

Edit `khb-registry.yml`. Site layout and publisher permissions are reviewed in
Git before they reach production:

```yaml
schema: 1

site:
  order: [product-docs]
  folders:
    - id: products
      title: Products
      children:
        - collection: product
  config:
    externalSources: true
    pwa: false
    prefetch: false
    prefetchLocked: false

publishers:
  - repository: acme/product
    ref: refs/heads/main
    environment: null
    docsets: [product-docs]
    force: false
```

Run `npm run validate` before committing. `force` should normally stay false:
published versions are immutable.

## Publish documentation

Add this job to the allowed content repository:

```yaml
name: Publish docs

on:
  push:
    branches: [main]
    paths: ["docs/**"]
  workflow_dispatch:

jobs:
  publish:
    uses: KDHelpBook/monorepo/.github/workflows/publish-registry.yml@v1
    with:
      registry-url: https://your-registry.workers.dev
      source: docs
    permissions:
      contents: read
      id-token: write
```

The `id` inside `docs/docset.toml` must occur in that repository's `docsets`
permission. The workflow uses a short-lived GitHub OIDC token; there are no
publisher secrets to copy.

## Local development

```sh
npm ci
npm run check
npm run dev
```

Wrangler stores a local R2 database under `.wrangler`. The generated viewer and
runtime configuration live under `.khb-registry`; both are disposable.

## Updates

Dependabot proposes updates to `@kdhelpbook/cf-registry`. Review the changelog,
let CI validate the package and configuration, then merge to deploy the new
Worker and matching viewer. This repository intentionally has no Cloudflare
preview deployments; normal static KD Help Book PR previews remain separate.
