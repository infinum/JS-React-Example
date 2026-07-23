FROM node:24.15.0-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# bash is needed by the wrapper shims under ./scripts (with-mise.sh,
# with-secrets.sh) that root + per-app pnpm scripts route through.
# Alpine ships only busybox sh, which lacks the bashisms ([[ ]], arrays).
RUN apk add --no-cache bash && corepack enable

# # # TURBO PRUNE
FROM base AS turbo
COPY . .
RUN pnpm dlx turbo@2.4.2 prune @infinum/storybook --docker

# # # Dependencies
FROM base AS dependencies
COPY --from=turbo /app/out/json ./
COPY --from=turbo /app/out/pnpm-lock.yaml ./

# There's no need to prune dev dependencies, because Storybook bundles the addons when needed anyways
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts


# # # Builder
FROM dependencies AS builder

COPY --from=turbo /app/out/full ./
# Root `pnpm build` runs ./scripts/with-mise.sh; scripts/ isn't part of
# `turbo prune --docker` output, so copy it explicitly. The wrapper falls
# through to plain `exec` inside the container (no mise to delegate to).
COPY scripts ./scripts

RUN pnpm build

# # # Production
FROM nginx:1.29.3-alpine-slim AS production

COPY --from=builder /app/apps/storybook/storybook-static /usr/share/nginx/html

COPY --from=builder /app/apps/storybook/docker-entrypoint.sh /docker-entrypoint.d/docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.d/docker-entrypoint.sh

EXPOSE 80
