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
RUN pnpm dlx turbo@2.4.2 prune @infinum/frontend --docker

# # # Dependencies
FROM base AS dependencies
COPY --from=turbo /app/out/json ./
COPY --from=turbo /app/out/pnpm-lock.yaml ./

# There's no need to prune dev dependencies, because Next uses standalone build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

# # # Development
FROM dependencies AS development

COPY --from=turbo /app/out/full ./
# Root `pnpm build` and the app's own `pnpm dev`/`pnpm build` route through
# ./scripts/with-mise.sh and ./scripts/with-secrets.sh respectively;
# scripts/ isn't part of `turbo prune --docker` output, so copy it
# explicitly. Both wrappers fall through to plain `exec` inside the
# container (no mise/op CLI to delegate to).
COPY scripts ./scripts

EXPOSE 3000

CMD ["pnpm", "dev"]

# # # Builder
FROM development AS builder

# Secrets needed for `next build` (envsafe validates them during static
# rendering). Passed in via docker-compose `build.args` from the host's
# env, which is populated by scripts/with-secrets.sh resolving op:// refs
# (locally) or the pipeline's env: block (CI). These ENV declarations are
# scoped to this stage — the production stage below restarts FROM base, so
# the values do not propagate into the final image.
ARG NEXTAUTH_SECRET
ARG TEST_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV TEST_SECRET=$TEST_SECRET

RUN pnpm build

# # # Production
FROM base AS production

COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/apps/frontend/.next/standalone ./
COPY --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static

EXPOSE 3000

CMD ["node", "apps/frontend/server.js"]
