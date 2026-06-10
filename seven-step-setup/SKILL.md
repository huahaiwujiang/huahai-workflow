---
name: seven-step-setup
description: 检测 seven-step 工作流所需的依赖是否安装到位，缺失时自动执行安装。在首次使用或换新机器时运行。触发词：检查依赖、setup、环境检测、依赖安装。
---

# seven-step-setup

检测并修复 7 步工作流运行所需的全部依赖。

## 使用方式

用户说"检查依赖"或"setup"时，执行检测脚本：

```bash
node .claude/skills/seven-step-setup/scripts/check-deps.mjs
```

## 失败处理

| 脚本输出 | 一线操作 | 仍失败兜底 |
|---------|---------|-----------|
| ✅ 所有依赖已就绪 | 无需操作 | — |
| ❌ 缺少 X 个依赖 | 依次执行每个缺失依赖的安装命令 | 重新运行检测脚本；仍缺失 → 🔴 CHECKPOINT，读安装日志定位原因 |

安装命令即脚本输出的 `→` 后面的内容，直接复制到终端执行。

## 检测项目

| 依赖 | 用于 | 安装命令 |
|------|------|---------|
| superpowers | 步骤3-5：设计/拆分/编码 | `claude plugin install superpowers@superpowers-marketplace` |
| OpenSpec | 步骤2/7：规格/归档 | `npm install -g @fission-ai/openspec@latest` |
| grill-me | 步骤1：需求追问 | `npx skills@latest add mattpocock/skills -g -y -s grill-me -s grill-with-docs` |
| grill-with-docs | 文档审查（可选） | 同上 |

## 🔴 CHECKPOINT 安装后验证

安装完成后，🛑 STOP 必须先验证再继续：

1. 重新运行 `node .claude/skills/seven-step-setup/scripts/check-deps.mjs`
2. 确认输出 `✅ 所有依赖已就绪`
3. 运行 `/reload-skills`，确认以下 skill 可见：
   - `superpowers:brainstorming` / `writing-plans` / `test-driven-development`
   - `opsx:propose` / `explore` / `archive`
   - `grill-me` / `grill-with-docs`

全部就绪 = 可以使用 7 步工作流。
任一缺失 = 🔴 重新执行对应安装命令。

## 🔴 反例

- ❌ 看到缺失提示但不执行安装 → 工作流无法运行
- ❌ 只安装部分依赖 → 某些步骤会卡住
- ❌ 安装后不 `/reload-skills` → AI 不识别新 skill
