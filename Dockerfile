FROM node:20.10.0-bookworm AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g pnpm@9.11.0

# # # PROJECT
FROM base as project
COPY . .

# # # PROD DEPENDENCIES
FROM project AS prod-dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --ignore-scripts

# # # BUILDER
FROM project AS builder
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --ignore-scripts

ARG NEXT_PUBLIC_BUGSNAG_API_KEY

RUN pnpm build

# # # RUNNER
FROM base AS runner
COPY --from=prod-dependencies /app/node_modules /app/node_modules

COPY --from=builder /app/.next/standalone/ /app/.next/standalone
COPY --from=builder /app/.next/static /app/.next/standalone/.next/static
COPY --from=builder /app/public /app/.next/standalone/public

CMD ["node", ".next/standalone/server.js"]
