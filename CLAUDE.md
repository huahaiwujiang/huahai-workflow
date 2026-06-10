# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

seven-step 是一个 Claude Code skill 集合，提供从追问到发布的 7 步开发工作流。通过 SKILL.md 文件定义 AI 行为规范，安装到目标项目的 `.claude/skills/` 下使用。

## 目录结构

```
seven-step/SKILL.md          # 核心 7 步工作流（追问→规格→设计→拆分→编码→审查→发布）
seven-step/gf/SKILL.md       # 内置 git flow 子 skill（状态→暂存→提交→拉取→推送→合并）
seven-step-setup/SKILL.md    # 依赖检测 skill（检查 superpowers / OpenSpec / grill-with-docs）
seven-step-setup/scripts/check-deps.mjs  # 依赖检测 Node.js 脚本
```

## 架构关键点

- **两个顶层 skill**：`seven-step`（运行时）和 `seven-step-setup`（安装时），用户分别复制到目标项目的 `.claude/skills/` 下
- **嵌套 skill**：`gf` 是 `seven-step` 的内置子 skill，位于 `seven-step/gf/`，触发词包括 `/gf`、`git flow`、`提交代码`、`合并分支`
- **依赖检测脚本**：`check-deps.mjs` 是纯 Node.js ES module，无需安装依赖，检查路径存在性判断 superpowers / OpenSpec / grill-me / grill-with-docs 是否安装
- **两个 🔴 CHECKPOINT 门禁**：步骤3→4 需要人类确认方案；步骤6→7 需要审查全部通过才能提交
- **会话恢复机制**：通过项目根目录的 `todolist.md` 追踪进度，AI 启动时必读

## 修改 skill 的注意事项

- SKILL.md 的 YAML frontmatter 中 `name` 和 `description` 字段决定 skill 的触发和显示
- 修改 `seven-step/SKILL.md` 的步骤链路时，需要同步更新路由裁决表和失败处理表
- `check-deps.mjs` 中的安装命令和检测路径需要与各依赖的实际安装位置保持一致（跨平台：Windows 用 `AppData\Roaming\openspec`，其他用 `~/.config/openspec` 之类）
- 嵌套 skill（如 `gf`）的目录名即 skill 名，Claude Code 通过目录结构发现

## 常见操作

```bash
# 运行依赖检测（等同于用户在 Claude Code 中说"检查依赖"）
node seven-step-setup/scripts/check-deps.mjs

# 安装到目标项目
cp -r seven-step <target>/.claude/skills/seven-step
cp -r seven-step-setup <target>/.claude/skills/seven-step-setup
```
