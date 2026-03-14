#!/usr/bin/env python3

from __future__ import annotations

import argparse
from datetime import datetime
from pathlib import Path
import re

ASSETS_README = """# Assets 目录说明

这里放支撑当前任务推进的补充材料，按需建子目录即可，不要求一次性建全。

推荐子目录：
- `research/`：调研记录、竞品资料、方案比较、外部链接摘录
- `bug-context/`：复现步骤、报错日志、截图、录屏、环境信息
- `api/`：接口文档、OpenAPI 片段、请求/响应样例、字段映射
- `data/`：测试数据、SQL、CSV、mock 数据
- `ui/`：线框图、视觉稿、交互截图
- `references/`：规范、会议纪要、上下游约束

保持“够用就建”，不必为了完整性预建所有目录。
"""


def normalize_name(raw_name: str) -> str:
    normalized = re.sub(r"[/\s]+", "-", raw_name.strip())
    normalized = re.sub(r"-{2,}", "-", normalized).strip("-")
    return normalized


def ensure_file(path: Path, content: str) -> None:
    if not path.exists():
        path.write_text(content, encoding="utf-8")


def build_task_dirname(raw_name: str) -> str:
    normalized = normalize_name(raw_name)
    if re.match(r"^\d{8}-", normalized):
        return normalized
    return f"{datetime.now().strftime('%Y%m%d')}-{normalized}"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Create a NanoSpec task skeleton without depending on the CLI."
    )
    parser.add_argument("task", help="Task topic or dated dirname")
    parser.add_argument(
        "--set-current",
        action="store_true",
        help="Also update .nanospec/.current",
    )
    args = parser.parse_args()

    raw_name = args.task.strip()
    dir_name = build_task_dirname(raw_name)
    task_dir = Path("nanospec") / dir_name

    (task_dir / "assets").mkdir(parents=True, exist_ok=True)
    (task_dir / "outputs").mkdir(parents=True, exist_ok=True)
    Path(".nanospec").mkdir(parents=True, exist_ok=True)

    ensure_file(
        task_dir / "brief.md",
        f"# {raw_name}\n\n目标：\n\n要求：\n1.\n",
    )
    ensure_file(task_dir / "alignment.md", "# Alignment Log\n\n")
    ensure_file(task_dir / "assets" / "README.md", ASSETS_README)
    ensure_file(task_dir / "outputs" / "1-spec.md", f"# 规格说明：{raw_name}\n\n")
    ensure_file(task_dir / "outputs" / "2-plan.md", f"# 方案：{raw_name}\n\n")
    ensure_file(
        task_dir / "outputs" / "3-tasks.md",
        "## 1. 待办\n\n"
        "- [ ] 1.1 补充 brief / prd，确认目标、范围与约束。\n"
        "- [ ] 1.2 产出或更新 `outputs/1-spec.md`。\n"
        "- [ ] 1.3 产出或更新 `outputs/2-plan.md` 与 `outputs/3-tasks.md`。\n",
    )

    if args.set_current:
        (Path(".nanospec") / ".current").write_text(f"{dir_name}\n", encoding="utf-8")

    print(f"Created task skeleton: {task_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
