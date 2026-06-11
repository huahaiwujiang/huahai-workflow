# seven-step — 7步工作流

从追问到发布的完整开发链路，面向 Claude Code 的项目级开发工作流。

## 工具有什么

两个 skill：

| Skill | 作用 |
|-------|------|
| `seven-step` | 核心工作流。7步链路编排：追问→规格→设计→拆分→编码→审查→发布。内置 `gf` git 流程。 |
| `seven-step-setup` | 依赖检测。检查 superpowers、OpenSpec、grill-with-docs 是否安装，缺失时给出安装命令。 |

## 安装

### 1. 克隆仓库

```bash
git clone git@github.com:huahaiwujiang/huahai-workflow.git
```

### 2. 安装到项目

将两个 skill 目录复制到目标项目的 `.claude/skills/` 下：

```bash
# 在目标项目根目录
cp -r huahai-workflow/seven-step .claude/skills/seven-step
cp -r huahai-workflow/seven-step-setup .claude/skills/seven-step-setup
```

### 3. 检查依赖

在 Claude Code 中说：

```
检查依赖
```

或手动运行：

```bash
node .claude/skills/seven-step-setup/scripts/check-deps.mjs
```

缺失的依赖按提示逐个安装。完成后 `/reload-skills`。

## 使用

安装完成后，AI 每次会话自动加载 seven-step，按 7 步链路推进：

```
步骤1: 追问   → Skill("grill-with-docs")         基于文档追问，对齐理解
步骤2: 规格   → Skill("opsx:propose")             写成规格文档
步骤3: 设计   → Skill("superpowers:brainstorming") 方案设计
     🔴 CHECKPOINT: 展示方案 → 等待人类确认
步骤4: 拆分   → Skill("superpowers:writing-plans") 拆成实施计划
步骤5: 编码   → Skill("superpowers:test-driven-development") RED → GREEN → REFACTOR
步骤6: 审查   → Skill("code-review") + Skill("security-review")
     🔴 CHECKPOINT: 检查清单全通过才能 commit
步骤7: 发布   → Skill("gf") + Skill("opsx:archive")  Git 提交 + 归档
```

开工时 AI 自动读 `todolist.md`（首次自动创建），从上次中断处继续。

## 依赖

| 依赖 | 用途 | 安装命令 |
|------|------|---------|
| superpowers | 设计/拆分/编码 | `claude plugin install superpowers@superpowers-marketplace` |
| OpenSpec | 规格/归档 | `npm install -g @fission-ai/openspec@latest` |
| grill-with-docs | 需求追问 + 文档审查 | `npx skills@latest add mattpocock/skills -g -y -s grill-me -s grill-with-docs` |

## 许可

MIT
