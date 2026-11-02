#!/bin/bash

# Installs the Playwright agent skills and agents from the installed @playwright/test version,
# so they always match it (both are gitignored and regenerated on every install).

if [ -n "${CI:-}" ]; then
	echo "   ⏭️  CI detected, skipping Playwright skills and agents"
	exit 0
fi

if [ ! -x node_modules/.bin/playwright ]; then
	echo "   ⏭️  Playwright not installed, skipping Playwright skills and agents"
	exit 0
fi

set -euo pipefail

root="$(pwd)"
skills=(playwright-cli playwright-trace playwright-component-testing)

echo "🎭 Installing Playwright skills..."

# init-skills copies over existing folders without clearing them, so start clean
for skill in "${skills[@]}"; do
	rm -rf ".agents/skills/$skill" ".claude/skills/$skill"
done

# Install into .agents/skills and symlink into .claude/skills, same layout as the `skills` CLI
node_modules/.bin/playwright init-skills --loop agents > /dev/null
mkdir -p .claude/skills
for skill in "${skills[@]}"; do
	ln -s "../../.agents/skills/$skill" ".claude/skills/$skill"
	echo "   ✅ $skill"
done

echo "🎭 Installing Playwright agents..."

# init-agents also overwrites .mcp.json and creates specs/ in the working directory,
# so run it in a temp directory and keep only the agent definitions
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

(cd "$tmp" && "$root/node_modules/.bin/playwright" init-agents --loop=claude -c "$root/playwright.config.ts" > /dev/null)

mkdir -p .claude/agents
rm -f .claude/agents/playwright-test-*.md
cp "$tmp"/.claude/agents/playwright-test-*.md .claude/agents/
for agent in .claude/agents/playwright-test-*.md; do
	echo "   ✅ $(basename "$agent" .md)"
done
