# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

huahai-workflow 是一个 Claude Code skill 集合，提供从追问到发布的开发工作流。通过 SKILL.md 文件定义 AI 行为规范，安装到目标项目的 `.claude/skills/` 下使用。

## 目录结构

```
huahai-workflow/SKILL.md          # 核心工作流（追问→设计→拆分→编码→审查→发布→归档）
huahai-workflow-gf/SKILL.md       # 内置 git flow skill（状态→暂存→提交→拉取→推送→合并）
huahai-workflow-setup/SKILL.md    # 依赖检测 skill（检查 superpowers / grill-with-docs）
huahai-workflow-setup/scripts/check-deps.mjs  # 依赖检测 Node.js 脚本
```

## 架构关键点

- **两个顶层 skill**：`huahai-workflow`（运行时）和 `huahai-workflow-setup`（安装时），用户分别复制到目标项目的 `.claude/skills/` 下
- **git flow skill**：`huahai-workflow-gf` 是独立 skill，触发词包括 `/gf`、`git flow`、`提交代码`、`合并分支`
- **依赖检测脚本**：`check-deps.mjs` 是纯 Node.js ES module，无需安装依赖，检查路径存在性判断 superpowers / grill-me / grill-with-docs 是否安装
- **三个 🔴 CHECKPOINT 门禁**：启动时询问文档输出目录；设计→拆分需要人类确认方案；审查→发布需要审查全部通过才能提交
- **会话恢复机制**：通过项目根目录的 `todolist.md` 追踪进度（进度指针），AI 启动时必读。真正的任务清单在 `<doc_root>/superpowers/plans/` 中
- **Skill 自然产出**：不截断 Skill 默认输出，只通过 `<doc_root>` 覆盖输出根。grill-with-docs → <doc_root>/grillme/NNNN-<title>-CONTEXT.md + adr/，brainstorming → <doc_root>/superpowers/specs/，writing-plans → <doc_root>/superpowers/plans/
- **文档归档**：步骤7将设计文档移到 `<doc_root>/superpowers/archive/YYYY-MM-DD-<feature>/`，保留设计决策

## 修改 skill 的注意事项

- SKILL.md 的 YAML frontmatter 中 `name` 和 `description` 字段决定 skill 的触发和显示
- 修改 `huahai-workflow/SKILL.md` 的步骤链路时，需要同步更新 CHECKPOINT 门禁和失败处理表
- 嵌套 skill（如 `gf`）的目录名即 skill 名，Claude Code 通过目录结构发现
