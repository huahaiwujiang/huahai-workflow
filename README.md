# huahai-workflow — 开发工作流

从追问到发布的完整开发链路，面向 Claude Code 的项目级开发工作流。

## 工具有什么

两个 skill：

| Skill | 作用 |
|-------|------|
| `huahai-workflow` | 核心工作流。追问→设计→拆分→编码→审查→发布。内置 `gf` git 流程。 |
| `huahai-workflow-setup` | 依赖检测。检查 superpowers、grill-with-docs 是否安装，缺失时给出安装命令。 |

## 安装

### 1. 克隆仓库

```bash
git clone git@github.com:huahaiwujiang/huahai-workflow.git
```

### 2. 安装到项目

将两个 skill 目录复制到目标项目的 `.claude/skills/` 下：

```bash
# 在目标项目根目录
cp -r huahai-workflow/huahai-workflow .claude/skills/huahai-workflow
cp -r huahai-workflow/huahai-workflow-setup .claude/skills/huahai-workflow-setup
```

### 3. 检查依赖

在 Claude Code 中说：

```
检查依赖
```

或手动运行：

```bash
node .claude/skills/huahai-workflow-setup/scripts/check-deps.mjs
```

缺失的依赖按提示逐个安装。完成后 `/reload-skills`。

## 使用

安装完成后，AI 每次会话自动加载 huahai-workflow，按链路推进：

```
步骤1: 追问   → Skill("grill-with-docs")              纯业务视角，WHAT 不 HOW
步骤2: 设计   → Skill("superpowers:brainstorming")     技术方案，HOW
     🔴 CHECKPOINT: 展示方案 → 等待人类确认
步骤3: 拆分   → Skill("superpowers:writing-plans")     拆成实施计划 + todolist.md
步骤4: 编码   → Skill("superpowers:test-driven-development") RED → GREEN → REFACTOR
步骤5: 审查   → Skill("code-review") + Skill("security-review")
     🔴 CHECKPOINT: 检查清单全通过才能 commit
步骤6: 发布   → Skill("gf")                            Git 提交 + 推送
```

开工时 AI 自动读 `todolist.md`（拆分阶段创建），从上次中断处继续。

## 依赖

| 依赖 | 用途 | 安装命令 |
|------|------|---------|
| superpowers | 设计/拆分/编码 | `claude plugin install superpowers@superpowers-marketplace` |
| grill-with-docs | 需求追问 + 文档审查 | `npx skills@latest add mattpocock/skills -g -y -s grill-me -s grill-with-docs` |

## 许可

MIT
