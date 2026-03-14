#!/bin/sh

set -eu

if [ "${1:-}" = "" ]; then
	echo "Usage: scripts/create-task-skeleton.sh <task-topic-or-dirname> [--set-current]" >&2
	exit 1
fi

raw_name=$1
set_current=0

if [ "${2:-}" = "--set-current" ]; then
	set_current=1
fi

date_prefix=$(date '+%Y%m%d')
normalized_name=$(printf '%s' "$raw_name" | tr '/ ' '--' | sed 's#--*#-#g; s#^-##; s#-$##')

case "$normalized_name" in
	????????-*)
		dir_name=$normalized_name
		;;
	*)
		dir_name="${date_prefix}-${normalized_name}"
		;;
esac

task_dir="nanospec/$dir_name"

mkdir -p "$task_dir/assets" "$task_dir/outputs" ".nanospec"

if [ ! -f "$task_dir/brief.md" ]; then
	cat >"$task_dir/brief.md" <<EOF
# ${raw_name}

目标：

要求：
1.
EOF
fi

if [ ! -f "$task_dir/alignment.md" ]; then
	cat >"$task_dir/alignment.md" <<'EOF'
# Alignment Log

EOF
fi

if [ ! -f "$task_dir/outputs/1-spec.md" ]; then
	cat >"$task_dir/outputs/1-spec.md" <<EOF
# 规格说明：${raw_name}

EOF
fi

if [ ! -f "$task_dir/outputs/2-plan.md" ]; then
	cat >"$task_dir/outputs/2-plan.md" <<EOF
# 方案：${raw_name}

EOF
fi

if [ ! -f "$task_dir/outputs/3-tasks.md" ]; then
	cat >"$task_dir/outputs/3-tasks.md" <<'EOF'
## 1. 待办

- [ ] 1.1 补充 brief / prd，确认目标、范围与约束。
- [ ] 1.2 产出或更新 `outputs/1-spec.md`。
- [ ] 1.3 产出或更新 `outputs/2-plan.md` 与 `outputs/3-tasks.md`。
EOF
fi

if [ "$set_current" -eq 1 ]; then
	printf '%s\n' "$dir_name" > .nanospec/.current
fi

printf 'Created task skeleton: %s\n' "$task_dir"
