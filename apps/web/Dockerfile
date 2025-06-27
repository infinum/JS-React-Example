FROM node:22.17.0-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# # # TURBO PRUNE
FROM base AS turbo
COPY . .
RUN pnpm dlx turbo@2.4.2 prune @infinum/web --docker

# # # Dependencies
FROM base AS dependencies
COPY --from=turbo /app/out/json ./
COPY --from=turbo /app/out/pnpm-lock.yaml ./

# There's no need to prune dev dependencies, because Next uses standalone build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

# # # Development
FROM dependencies AS development

COPY --from=turbo /app/out/full ./

EXPOSE 3000

CMD ["pnpm", "dev"]

# # # Builder
FROM development AS builder

RUN pnpm build

# # # Production
FROM base AS production

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
