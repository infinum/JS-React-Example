# Tool Management (mise)

> **TL;DR**
>
> 1. **`mise` is required** — it pins `node` and `pnpm` versions for every contributor and CI runner, using [mise.lock](../mise.lock) to verify each binary against a SHA256 checksum before running it.
> 2. **One-time setup:** `brew install mise`, then `mise trust && mise install` from the repo root.
> 3. **Task runner too** — `mise dev`, `mise build`, `mise e2e`, etc. wrap the `pnpm` scripts and are the commands developers are expected to use day-to-day.
> 4. **Secrets pipeline** — per-app `mise.toml` files inject secrets from the secret store at task-run time (see [Environment Variables — Secrets](./Environment%20variables.md#secrets)).
> 5. **Security story** — this setup is the project's implementation of the [Infinum handbook's Node.js security guidelines](https://infinum.com/handbook/frontend/node/security/overview) *(internal)*. Please read the handbook for the full rationale.

## Why mise?

Node.js tooling is one of the most aggressively targeted parts of the modern software supply chain. In 2025 and 2026 alone, attackers compromised packages with hundreds of millions of weekly downloads, and the pattern is not slowing down. The [Infinum handbook's Node.js security overview](https://infinum.com/handbook/frontend/node/security/overview) *(internal)* covers this threat model in depth, along with the tool-management, dependency-hardening, and AI-assisted-development guidelines this repo implements. Internal readers can navigate to the sub-sections from the overview page; the overview is the only handbook link referenced from this repo.

This repo follows the handbook's tool-management recommendation. [mise](https://mise.jdx.dev/) (pronounced "meez") was chosen over alternatives (`nvm`, `fnm`, `volta`, `asdf`, `corepack`) because it:

1. **Pins every tool in one file** — `node`, `pnpm`, and anything else the project adopts later (e.g. `bun`, `deno`, `jq`), using the single [mise.toml](../mise.toml).
2. **Verifies binaries against a committed lockfile** — [mise.lock](../mise.lock) records the SHA256 of each tool binary for each supported platform. On `mise install`, mise re-downloads and checks the hash before putting the binary on your PATH.
3. **Doubles as a task runner with scoped env** — lets us inject secrets into a single task's process without exporting them to the shell or writing them to disk. This is what makes the [secret injection pattern](./Environment%20variables.md#secrets) possible.
4. **Works identically on developer machines, Docker builds, and CI** — no branching logic for "is this a developer laptop?"

### What this setup protects against

- **Compromised tool distributions** — if `nodejs.org` or the pnpm release bucket were ever replaced with a malicious binary, `mise install` would fail the checksum check against [mise.lock](../mise.lock) instead of silently installing the tampered binary.
- **Version drift** — every contributor and every CI job runs the exact same `node` and `pnpm` versions. No "works on my machine" from a floating major version.
- **Secrets on disk** — because mise can run tasks with per-task `env`, we never need to write real secrets to `.env`, `.env.local`, or any other tracked or gitignored file.
- **AI agents running `npm install -g` on your behalf** — when an agent (or a well-meaning tutorial) tries to install a global tool, mise's project-scoped shims mean the agent can't reach past the pinned set without an explicit edit to `mise.toml`, which is code-reviewed like any other change.

### What this setup does **not** protect against

mise is one layer of defense. It does not protect you from:

- Malicious packages pulled in as transitive dependencies — that is the job of the [pnpm hardening settings](../README.md#pnpm-config) (`minimumReleaseAge`, `onlyBuiltDependencies`, `strictDepBuilds`).
- Prompt injection or malicious MCP servers in AI tooling.
- Malicious IDE extensions.
- Social engineering.

See the handbook overview for the full scope of what's in and out of the Node.js security guidelines.

## Installation

### Install mise itself

mise is a single static Go binary with no runtime dependencies. On macOS:

```sh
brew install mise
```

For other platforms (Linux, Windows, manual install) follow [mise's installation guide](https://mise.jdx.dev/getting-started.html).

Add the mise shell activation to your shell's rc file (zsh example):

```sh
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
```

Restart your shell. From this point on, whenever you `cd` into a directory with a `mise.toml`, mise will automatically put the pinned tool versions on your PATH.

### Install this project's tools

From the repo root:

```sh
mise trust    # one-time: approve this repo's mise.toml
mise install  # download + checksum-verify node and pnpm
```

Verify:

```sh
node --version   # should match mise.toml [tools] node
pnpm --version   # should match mise.toml [tools] pnpm
which node       # should resolve to a path under ~/.local/share/mise/installs/
```

## Repo layout

This repo uses **two layers** of mise configuration:

```
mise.toml                    # root: tool versions + task delegates (SECRET-FREE)
mise.lock                    # root: checksums for node and pnpm (auto-generated, committed)
apps/frontend/mise.toml      # per-app: task env with secret-store templates
```

### Root [mise.toml](../mise.toml) — tool versions and task delegates

- `[settings]` enables `lockfile = true` (checksum verification) and `install_before = "7d"` (warn if tools are about to be auto-upgraded before a deadline we don't want).
- `[tools]` pins `node` and `pnpm`.
- `[tasks.*]` are thin delegates that forward to the corresponding `pnpm` script (`pnpm run dev`, `pnpm run build`, ...). They carry no `env` block — **the root mise config is intentionally secret-free**.

Why secret-free at the root:

- **Secrets belong to the app that needs them, not to the whole monorepo.** Declaring `NEXTAUTH_SECRET` (or any other app-specific secret) at the root would leak it into every task, every app, and every package — an anti-pattern in a monorepo where the frontend's auth secret has no business being visible to the storybook build, a shared UI package, or a script in `scripts/`. Each app's own `mise.toml` is the right scope.
- **CI doesn't need vault access.** `mise docker:prod -- up -d` (and any other root task) can run in CI without the 1Password vault, because the pipeline provides secrets via its own `env:` block. Root-level `op read` calls would make this impossible.
- **Smaller blast radius.** If a developer's shell history, terminal buffer, or machine is ever compromised, the root config alone is not enough to reconstruct the project's secrets — you'd also need access to the per-app config *and* the 1Password session.

### Per-app [apps/frontend/mise.toml](../apps/frontend/mise.toml) — task env with secrets

- `[tasks.dev].env`, `[tasks.build].env`, `[tasks.start].env` declare each secret using mise's command-substitution templating to shell out to the secret-store CLI (1Password's `op read` in this project).
- `[env] _.file = ".env.local"` pulls in non-secret per-developer overrides.
- `env_shell_expand = false` is critical here. See the [Environment Variables guide](./Environment%20variables.md#why-env_shell_expand--false) for the details.

When you run `mise dev` from the repo root, mise walks the parent chain, loads both `mise.toml` files, evaluates the command-substitution templates for that task, and starts the child process with secrets already in `process.env`. Nothing is written to disk; nothing leaks to unrelated shell commands.

For the full secrets story, alternative backends, CI setup, and how to add a new secret, see the [Environment Variables — Secrets section](./Environment%20variables.md#secrets).

## Daily usage

```sh
mise dev              # start all apps in dev (equivalent to pnpm dev, + secrets)
mise build            # build all apps and packages
mise start            # run all apps in production mode
mise test             # run unit tests
mise e2e              # run Playwright E2E tests
mise docker:prod      # forward args to docker compose (see Docker Setup guide)
```

Listing available tasks:

```sh
mise tasks
```

You can still run `pnpm <script>` directly — the mise tasks are just wrappers that add secret injection where relevant.

## Updating tool versions

1. Edit `[tools]` in [mise.toml](../mise.toml) with the new version.
2. Run `mise install` — this downloads the new binary and refreshes [mise.lock](../mise.lock) with the new checksum.
3. Commit both `mise.toml` and `mise.lock` in the same PR. Reviewers should verify the lockfile changes look plausible (only the expected tool and checksums changed).
4. Keep `engines.node` in [package.json](../package.json) and any `FROM node:<version>-alpine` lines in Dockerfiles in sync so `pnpm`'s `engineStrict` and Docker builds agree with mise.

## Troubleshooting

- **`command not found: mise`** — shell activation is missing. Re-run `eval "$(mise activate zsh)"` or add it to your rc file.
- **`mise trust` was not run** — mise refuses to evaluate a new `mise.toml` until you've explicitly trusted it. Run `mise trust` from the repo root.
- **Checksum mismatch on `mise install`** — do **not** bypass this. Stop, report to the security team (see the [handbook overview](https://infinum.com/handbook/frontend/node/security/overview) *(internal)* for incident-response guidance), and do not install the binary.
- **Wrong node/pnpm on PATH** — `which node` should resolve under `~/.local/share/mise/installs/...`. If it points at Homebrew or nvm, your shell activation is shadowed; check your rc file order.
- **1Password prompts every time** — make sure **Settings → Developer → Integrate with 1Password CLI** is enabled in the 1Password desktop app. If you still get prompted, your session token is expiring; that's controlled by your 1Password account's session-length policy.

## Related documentation

- [Environment Variables](./Environment%20variables.md) — the secrets pipeline in detail
- [Docker Setup](./Docker%20setup.md) — how `mise docker:prod` forwards args and secrets into compose
- [Infinum handbook — Node.js Security](https://infinum.com/handbook/frontend/node/security/overview) *(internal)* — the broader story this setup implements
