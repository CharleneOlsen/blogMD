docker run --rm \
  -v "$PWD":/app:Z \
  -w /app \
  node:20 sh -lc "corepack enable && pnpm install --lockfile-only"
