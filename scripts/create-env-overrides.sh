#!/bin/bash

echo "🔧 Creating environment overrides..."

for app in apps/*/; do
	[ -d "$app" ] || continue

	app_name=$(basename "$app")
	echo "   📁 Processing $app_name..."

	# 1) .env.local from .env
	if [ -f "${app}.env" ] && [ ! -f "${app}.env.local" ]; then
		cp "${app}.env" "${app}.env.local"
		echo "      ✅ Created .env.local from .env"
	elif [ -f "${app}.env.local" ]; then
		echo "      ⏭️  .env.local already exists"
	else
		echo "      ⚠️  .env not found (skipping .env.local)"
	fi

	# 2) .env.compose.local from .env.compose
	if [ -f "${app}.env.compose" ] && [ ! -f "${app}.env.compose.local" ]; then
		cp "${app}.env.compose" "${app}.env.compose.local"
		echo "      ✅ Created .env.compose.local from .env.compose"
	elif [ -f "${app}.env.compose.local" ]; then
		echo "      ⏭️  .env.compose.local already exists"
	else
		echo "      ⚠️  .env.compose not found"
	fi
done

echo "✨ Environment overrides completed"
