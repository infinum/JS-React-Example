#!/bin/bash

echo "🔧 Creating environment overrides..."

for app in apps/*/; do
	if [ ! -d "$app" ]; then
		continue
	fi

	app_name=$(basename "$app")
	echo "   📁 Processing $app_name..."

	# Check if .env.local exists and .env.development.local doesn't exist
	if [ -f "${app}.env.local" ] && [ ! -f "${app}.env.development.local" ]; then
		cp "${app}.env.local" "${app}.env.development.local"
		echo "      ✅ Created .env.development.local"
	elif [ -f "${app}.env.local" ]; then
		echo "      ⏭️  .env.development.local already exists"
	else
		echo "      ⚠️  .env.local not found"
	fi

	# Check if .env.compose exists and .env.compose.local doesn't exist
	if [ -f "${app}.env.compose" ] && [ ! -f "${app}.env.compose.local" ]; then
		cp "${app}.env.compose" "${app}.env.compose.local"
		echo "      ✅ Created .env.compose.local"
	elif [ -f "${app}.env.compose" ]; then
		echo "      ⏭️  .env.compose.local already exists"
	else
		echo "      ⚠️  .env.compose not found"
	fi
done

echo "✨ Environment overrides completed"
