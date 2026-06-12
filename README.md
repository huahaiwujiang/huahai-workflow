# huahai-workflow — 开发工作流

从追问到归档的完整开发链路，面向 Claude Code 的项目级开发工作流。

## 工具有什么

两个 skill：

| Skill | 作用 |
|-------|------|
| `huahai-workflow` | 核心工作流。追问→设计→拆分→编码→审查→发布→归档。 |
| `huahai-workflow-gf` | Git 流程。状态→暂存→提交→拉取→推送→合并。 |
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
cp -r huahai-workflow/huahai-workflow-gf .claude/skills/huahai-workflow-gf
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
🔴 启动门禁: 询问文档输出目录（默认 docs/），写入 todolist.md 顶部

步骤1: 追问   → Skill("grill-with-docs")               纯业务视角，WHAT 不 HOW
               产出: <doc_root>/grillme/NNNN-<title>-CONTEXT.md + adr/NNNN-<title>.md
步骤2: 设计   → Skill("superpowers:brainstorming")      技术方案，HOW
               产出: <doc_root>/superpowers/specs/YYYY-MM-DD-<topic>-design.md
     🔴 CHECKPOINT: 展示方案 → 等待人类确认
步骤3: 拆分   → Skill("superpowers:writing-plans")      实施计划 + 任务清单
               产出: <doc_root>/superpowers/plans/YYYY-MM-DD-<feature>.md
     🔴 CHECKPOINT: 计划确认无遗漏
步骤4: 编码   → Skill("superpowers:test-driven-development") RED → GREEN → REFACTOR
步骤5: 审查   → Skill("code-review") + Skill("security-review")
     🔴 CHECKPOINT: 检查清单全通过才能 commit
步骤6: 发布   → Skill("gf")                             Git 提交 + 推送
步骤7: 归档   → 设计文档移到 <doc_root>/superpowers/archive/YYYY-MM-DD-<feature>/
               删除 todolist.md
```

开工时 AI 自动读 `todolist.md`（启动门禁创建，进度指针），从上次中断处继续。

## 文档目录

两个层级：

| 位置 | 文件 | 说明 |
|------|------|------|
| 项目根目录 | `todolist.md` | 进度指针 |
| 项目根目录 | `CONTEXT.md` | grill-with-docs 术语表 |
| `<doc_root>/superpowers/specs/` | brainstorming 设计文档 | 步骤2产出 |
| `<doc_root>/superpowers/plans/` | writing-plans 实施计划 | 步骤3产出，内含任务清单 |
| `<doc_root>/superpowers/archive/` | 归档文档 | 步骤7移入 |
| `<doc_root>/adr/` | 架构决策记录 | grill-with-docs 产出 |

## 依赖

| 依赖 | 用途 | 安装命令 |
|------|------|---------|
| superpowers | 设计/拆分/编码 | `claude plugin install superpowers@superpowers-marketplace` |
| grill-with-docs | 需求追问 + 文档审查 | `npx skills@latest add mattpocock/skills -g -y -s grill-me -s grill-with-docs` |

## 许可

MIT
