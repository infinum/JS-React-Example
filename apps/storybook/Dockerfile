FROM node:24.11.0-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

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

RUN pnpm build

# # # Production
FROM nginx:1.29.0-alpine-slim AS production

COPY --from=builder /app/apps/storybook/storybook-static /usr/share/nginx/html

COPY --from=builder /app/apps/storybook/docker-entrypoint.sh /docker-entrypoint.d/docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.d/docker-entrypoint.sh

EXPOSE 80
