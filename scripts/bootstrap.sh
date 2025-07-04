steps=(
	"create-env-overrides.sh"
)

echo "🚀 Bootstrapping the project..."

for step in "${steps[@]}"; do
	script_path="./scripts/$step"
	if [ ! -f "$script_path" ]; then
		echo "❌ Script not found: $script_path"
		exit 1
	fi

	if [ ! -x "$script_path" ]; then
		chmod +x "$script_path"
	fi

	echo "▶️  Running $step..."
	if ! eval "$script_path"; then
		echo "❌ Failed to run $step"
		exit 1
	fi
	echo ""
done

echo "🎉 Project bootstrapped successfully!"
