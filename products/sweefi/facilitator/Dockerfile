# @sweefi/facilitator — multi-stage Docker build
#
# This is a pnpm workspace package with workspace:^ dependencies.
# Build from the platform monorepo root:
#
#   docker build -f products/sweefi/facilitator/Dockerfile -t sweefi-facilitator .
#
# For Fly.io, run from the platform monorepo root:
#   fly deploy --config products/sweefi/facilitator/fly.toml \
#              --dockerfile products/sweefi/facilitator/Dockerfile

FROM node:22-slim AS base
RUN npm install -g pnpm@10.33.0

FROM base AS build
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY products/ ./products/
# shared/ is in pnpm-workspace.yaml but not yet populated; uncomment when packages land there:
# COPY shared/ ./shared/
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @sweefi/facilitator... build
RUN pnpm --filter @sweefi/facilitator deploy /deploy --prod --legacy

FROM node:22-slim AS runtime
WORKDIR /app
COPY --from=build /deploy ./
ENV NODE_ENV=production
EXPOSE 4022
CMD ["node", "dist/cli.mjs", "start"]
