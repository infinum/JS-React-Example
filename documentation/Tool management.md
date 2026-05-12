# Tool Management (mise)

> **TL;DR**
>
> 1. **`mise` is required** — it pins `node` and `pnpm` versions for every contributor and CI runner, using [mise.lock](../mise.lock) to verify each binary against a SHA256 checksum before running it.
> 2. **One-time setup:** `brew install mise`, then `mise trust && mise install` from the repo root. Add `eval "$(mise activate zsh)"` to your shell rc so the pinned versions are on PATH whenever you `cd` into the repo.
> 3. **Day-to-day commands stay `pnpm`** — `pnpm dev`, `pnpm build`, `pnpm test`, etc. The root scripts route through [scripts/with-mise.sh](../scripts/with-mise.sh), which prefixes `mise exec --` when mise is available, so the pinned toolchain is used even if your shell isn't activated.
> 4. **Secrets pipeline** — a small provider-agnostic wrapper ([scripts/with-secrets.sh](../scripts/with-secrets.sh)) injects secrets into the relevant tasks (see [Environment Variables — Secrets](./Environment%20variables.md#secrets)).
> 5. **Security story** — this setup is the project's implementation of the [Infinum handbook's Node.js security guidelines](https://infinum.com/handbook/frontend/node/security/overview) *(internal)*. Please read the handbook for the full rationale.

## Why mise?

Node.js tooling is one of the most aggressively targeted parts of the modern software supply chain. In 2025 and 2026 alone, attackers compromised packages with hundreds of millions of weekly downloads, and the pattern is not slowing down. The [Infinum handbook's Node.js security overview](https://infinum.com/handbook/frontend/node/security/overview) *(internal)* covers this threat model in depth, along with the tool-management, dependency-hardening, and AI-assisted-development guidelines this repo implements. Internal readers can navigate to the sub-sections from the overview page; the overview is the only handbook link referenced from this repo.

This repo follows the handbook's tool-management recommendation. [mise](https://mise.jdx.dev/) (pronounced "meez") was chosen over alternatives (`nvm`, `fnm`, `volta`, `asdf`, `corepack`) because it:

1. **Pins every tool in one file** — `node`, `pnpm`, and anything else the project adopts later (e.g. `bun`, `deno`, `jq`), using the single [mise.toml](../mise.toml).
2. **Verifies binaries against a committed lockfile** — [mise.lock](../mise.lock) records the SHA256 of each tool binary for each supported platform. On `mise install`, mise re-downloads and checks the hash before putting the binary on your PATH.
3. **Works identically on developer machines, Docker builds, and CI** — no branching logic for "is this a developer laptop?"

### What this setup protects against

- **Compromised tool distributions** — if `nodejs.org` or the pnpm release bucket were ever replaced with a malicious binary, `mise install` would fail the checksum check against [mise.lock](../mise.lock) instead of silently installing the tampered binary.
- **Version drift** — every contributor and every CI job runs the exact same `node` and `pnpm` versions. No "works on my machine" from a floating major version. [pnpm-workspace.yaml](../pnpm-workspace.yaml)'s `engineStrict: true` setting combined with `engines.{node,pnpm}` in [package.json](../package.json) makes `pnpm install` fail when either version doesn't match, so a contributor running with their system node/pnpm gets a clear error rather than a confusing runtime failure.
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

`mise.toml` lives at the repo root and contains only tool-management config — no tasks, no secrets:

```
mise.toml      # [settings] + [tools] — what to pin
mise.lock      # SHA256 checksums for the pinned binaries (auto-generated)
```

There is **no per-app `mise.toml`**. Secret injection is handled by [scripts/with-secrets.sh](../scripts/with-secrets.sh), invoked from per-app pnpm scripts — see [Environment Variables — Secrets](./Environment%20variables.md#secrets).

## Daily usage

Day-to-day, just use the pnpm scripts. The root scripts route through [scripts/with-mise.sh](../scripts/with-mise.sh) — a tiny shim that prefixes `mise exec --` when mise is on PATH, so the pinned toolchain is used even from a shell that hasn't been activated:

```sh
pnpm dev              # start all apps in dev (secrets injected via with-secrets.sh)
pnpm build            # build all apps and packages
pnpm start            # run all apps in production mode
pnpm test             # run unit tests
pnpm e2e              # run Playwright E2E tests
pnpm docker:prod      # docker compose for the production stack (see Docker Setup guide)
```

You can also invoke `mise exec -- <cmd>` manually for any command that should run under the pinned toolchain (e.g. `mise exec -- node ./scripts/foo.js`).

## Why the `with-mise.sh` shim on the root scripts?

`pnpm dev` resolves whichever `node` and `pnpm` are on PATH. With shell activation that's the mise-pinned binary; without it, it's whatever else the user has installed (homebrew, fnm, volta, nvm, system). Routing the root scripts through [scripts/with-mise.sh](../scripts/with-mise.sh) forces every local invocation through `mise exec --`, so a contributor who hasn't sourced `mise activate` still gets the verified toolchain. Turbo's child processes inherit the activated PATH, so the shim is needed only at the top level.

The shim falls through to plain `exec` when mise isn't on PATH — that's the CI path. CI runners provision node via `actions/setup-node` reading [package.json](../package.json)'s `engines.node` and never install mise, so the prefix would otherwise break CI. The shim makes the root scripts portable between both contexts without changing what gets typed.

pnpm's own `engineStrict` (set in [pnpm-workspace.yaml](../pnpm-workspace.yaml)) is the second line of defense: even if a contributor bypasses `mise exec` and runs `pnpm install` directly with the wrong node or pnpm version, pnpm fails the install before any code runs.

## Updating tool versions

1. Edit `[tools]` in [mise.toml](../mise.toml) with the new version.
2. Run `mise install` — this downloads the new binary and refreshes [mise.lock](../mise.lock) with the new checksum.
3. Commit both `mise.toml` and `mise.lock` in the same PR. Reviewers should verify the lockfile changes look plausible (only the expected tool and checksums changed).
4. Keep `engines.node` in [package.json](../package.json) and any `FROM node:<version>-alpine` lines in Dockerfiles in sync so `pnpm`'s `engineStrict` and Docker builds agree with mise.

## Troubleshooting

- **`command not found: mise`** — shell activation is missing. Re-run `eval "$(mise activate zsh)"` or add it to your rc file.
- **`mise trust` was not run** — mise refuses to evaluate a new `mise.toml` until you've explicitly trusted it. Run `mise trust` from the repo root.
- **`pnpm install` fails with "Unsupported engine"** — pnpm's `engineStrict` detected your shell is running a non-pinned node or pnpm. Run `mise install` and ensure shell activation is configured (see [Install mise itself](#install-mise-itself)).
- **Checksum mismatch on `mise install`** — do **not** bypass this. Stop, report to the security team (see the [handbook overview](https://infinum.com/handbook/frontend/node/security/overview) *(internal)* for incident-response guidance), and do not install the binary.
- **Wrong node/pnpm on PATH** — `which node` should resolve under `~/.local/share/mise/installs/...`. If it points at Homebrew or nvm, your shell activation is shadowed; check your rc file order.
- **1Password prompts every time** — make sure **Settings → Developer → Integrate with 1Password CLI** is enabled in the 1Password desktop app. If you still get prompted, your session token is expiring; that's controlled by your 1Password account's session-length policy.

## Related documentation

- [Environment Variables](./Environment%20variables.md) — the secrets pipeline in detail
- [Docker Setup](./Docker%20setup.md) — how `pnpm docker:prod` forwards args and secrets into compose
- [Infinum handbook — Node.js Security](https://infinum.com/handbook/frontend/node/security/overview) *(internal)* — the broader story this setup implements
