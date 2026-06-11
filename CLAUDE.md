# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

huahai-workflow 是一个 Claude Code skill 集合，提供从追问到发布的开发工作流。通过 SKILL.md 文件定义 AI 行为规范，安装到目标项目的 `.claude/skills/` 下使用。

## 目录结构

```
huahai-workflow/SKILL.md          # 核心工作流（追问→设计→拆分→编码→审查→发布）
huahai-workflow/gf/SKILL.md       # 内置 git flow 子 skill（状态→暂存→提交→拉取→推送→合并）
huahai-workflow-setup/SKILL.md    # 依赖检测 skill（检查 superpowers / grill-with-docs）
huahai-workflow-setup/scripts/check-deps.mjs  # 依赖检测 Node.js 脚本
```

## 架构关键点

- **两个顶层 skill**：`huahai-workflow`（运行时）和 `huahai-workflow-setup`（安装时），用户分别复制到目标项目的 `.claude/skills/` 下
- **嵌套 skill**：`gf` 是 `huahai-workflow` 的内置子 skill，位于 `huahai-workflow/gf/`，触发词包括 `/gf`、`git flow`、`提交代码`、`合并分支`
- **依赖检测脚本**：`check-deps.mjs` 是纯 Node.js ES module，无需安装依赖，检查路径存在性判断 superpowers / grill-me / grill-with-docs 是否安装
- **两个 🔴 CHECKPOINT 门禁**：设计→拆分 需要人类确认方案；审查→发布 需要审查全部通过才能提交
- **会话恢复机制**：通过项目根目录的 `todolist.md` 追踪进度，AI 启动时必读
- **追问/设计 边界**：追问阶段只输出 WHAT（用户故事、验收条件、业务规则），禁止 API/表结构/技术栈；设计阶段输出 HOW（技术方案）

## 修改 skill 的注意事项

- SKILL.md 的 YAML frontmatter 中 `name` 和 `description` 字段决定 skill 的触发和显示
- 修改 `huahai-workflow/SKILL.md` 的步骤链路时，需要同步更新 CHECKPOINT 门禁和失败处理表
- 嵌套 skill（如 `gf`）的目录名即 skill 名，Claude Code 通过目录结构发现
