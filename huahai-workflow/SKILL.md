---
name: huahai-workflow
description: 开发工作流——从需求追问到代码发布。当用户提出开发任务、新功能、要做某个特性、/huahai-workflow 时触发。即使用户想跳过步骤直接写代码，也应先走此流程确保方向正确。
---

# 开发工作流

> grill-with-docs 管追问，brainstorming 管设计，writing-plans 管拆分，内置命令管审查。

**平台依赖**：本工作流基于 Claude Code 的 Skill 体系构建（grill-with-docs、superpowers、code-review、security-review 均为 Claude 生态技能）。其他 AI 工具需自行适配 Skill 调用机制。

## 🧭 启动决策树（读到本 skill 后第一件事）

```
读 todolist.md（始终在项目根目录）
├─ 不存在 ──→ 1. 问用户：「grill-with-docs 和 superpowers 的文档输出到哪个目录？」（默认 docs/）
│             2. 创建 todolist.md，写入顶部元信息（doc_root + 阶段: 步骤1）
│             3. 从步骤1开始
├─ 存在 + 有未勾选任务 ──→ 跳到对应步骤继续
└─ 存在 + 全部已勾选
   ├─ 已发布（git log origin/main..HEAD 为空，无未推送提交）──→ 删除 todolist.md，问"新功能？"→ 重新走启动流程
   └─ 未发布 ──→ 提示用户先执行步骤6发布 + 步骤7归档
```

## 工作流链路

每一步都有明确的 **输入 → Skill → 自然产出 → 完成标志**。Skill 按其自身流程运行，工作流只做编排，不截断输出。

todolist.md 在启动时创建（仅含 doc_root + 阶段），随步骤推进逐步填充元信息和任务清单。

```
步骤1: 追问（WHAT — 用户要什么）
  🔴 强制: Skill("grill-with-docs")
  输入: 用户提供的需求文档/描述
  自然产出:
    - <doc_root>/grillme/NNNN-<title>-CONTEXT.md（术语表）
    - <doc_root>/grillme/adr/NNNN-<title>.md（架构决策记录）
  规则: 以项目文档为主理解业务。文档不足时可读代码补充理解，但追问输出不应包含技术实现细节（API 路径、表结构、技术栈选择）
  完成: grill-with-docs 流程结束，更新 todolist.md 阶段为「步骤2」

步骤2: 设计（HOW — 怎么实现）
  🔴 强制: Skill("superpowers:brainstorming")
  输入: 步骤1的产出文档 + 项目现有代码 + PRD 文档
  自然产出: <doc_root>/superpowers/specs/YYYY-MM-DD-<name>-design.md
  完成: 🔴 CHECKPOINT — 用户确认方案后，更新 todolist.md：
    1. 写入 `<!-- spec: <设计文档路径> -->`
    2. 更新阶段为「步骤3」

步骤3: 拆分
  🔴 强制: Skill("superpowers:writing-plans")
  输入: 读 todolist.md 元信息 `<!-- spec: -->` 获取设计文档路径
  自然产出: <doc_root>/superpowers/plans/YYYY-MM-DD-<name>.md（内含 checkbox 任务清单）
  完成: 🔴 CHECKPOINT — 计划文档已写入，更新 todolist.md：
    1. 写入 `<!-- plan: <计划文档路径> -->`
    2. 从计划文档中提取任务摘要，写入 `- [ ] 任务描述`
    3. 更新阶段为「步骤4」

步骤4: 编码
  🔴 强制: Skill("superpowers:test-driven-development")
  输入: todolist.md（任务清单）+ 元信息 `<!-- plan: -->` 指向的计划文档
  完成: todolist.md 所有任务 ✅，代码类任务测试全绿

步骤5: 审查
  🔴 强制（两步都要跑，不可跳过）:
    1. Skill("code-review")
    2. Skill("security-review")
  输入: 编码阶段的代码变更
  完成: 🔴 CHECKPOINT — 检查清单全通过

步骤6: 发布
  🔴 强制: Skill("huahai-workflow-gf")
  输入: 审查通过的代码
  完成: 代码已推送

步骤7: 归档
  输入: todolist.md 元信息 `<!-- spec: -->` 和 `<!-- plan: -->` 指向的文档
  动作:
    1. 将 spec + plan 文档移到 <doc_root>/superpowers/archive/YYYY-MM-DD-<name>/
    2. 删除 todolist.md
  完成: 设计产物已归档，临时文件已清理
```

### 每一步完成后

1. 勾选 `todolist.md` 中对应任务（如有）
2. 确认完成标志已达成
3. 进入下一步

## 🔴 CHECKPOINT 门禁

### 设计→拆分：人类确认（铁律）
设计文档写入后，向用户展示并等待明确确认。未确认 = 🛑 STOP。

### 拆分→编码：计划确认
计划文档写入后，确认任务清单无遗漏。

### 审查→发布：提交前检查清单
- [ ] TDD 测试全部通过
- [ ] Skill("code-review") 通过，无 CRITICAL 问题
- [ ] Skill("security-review") 通过（涉及 auth/finance/system 时强制）
- [ ] 计划文档中对应任务全部 ✅
- [ ] <doc_root>/superpowers/specs/ 和 <doc_root>/superpowers/plans/ 已就绪

全部通过 → 提交。任一未通过 → 🛑 STOP，先补。

## todolist.md 规约

- **位置**：始终在项目根目录（不在 <doc_root>/ 下）
- **定位**：进度指针，不重复计划内容。真正的任务细节在计划文档中
- **生命周期**：

  | 阶段 | 操作 | 内容 |
  |------|------|------|
  | 启动 | 创建 | `<!-- doc_root: -->` + `<!-- 阶段: 步骤1 -->` |
  | 步骤1 完成 | 更新 | 阶段 → 步骤2 |
  | 步骤2 完成 | 更新 | `<!-- spec: -->` + 阶段 → 步骤3 |
  | 步骤3 完成 | 更新 | `<!-- plan: -->` + 任务清单 + 阶段 → 步骤4 |
  | 步骤4-6 | 勾选 | 逐个 `[x]` 完成任务 |
  | 步骤7 完成 | 删除 | 归档后删除 todolist.md |

- **顶部元信息**：
  ```
  <!-- doc_root: <绝对或相对路径> -->
  <!-- spec: <设计文档路径> -->
  <!-- plan: <计划文档路径> -->
  <!-- 阶段: <当前步骤> -->
  ```
- **格式**：每行 `- [ ] 任务描述`（步骤3从计划文档中提取摘要），已完成改为 `- [x]`
- **gitignore**：应加入 `.gitignore`
- **损坏处理**：格式无法解析时，按以下优先级推断当前进度：
  1. `superpowers/plans/` 有最新文件 → 步骤4+
  2. `superpowers/specs/` 有最新文件 → 步骤3+
  3. `grillme/` 有最新文件 → 步骤2+
  4. 以上均无 → 步骤1
  推断后从该步骤重新开始，重建 todolist.md

## 文档目录约定

两个目录层级：

**项目根目录（不受 doc_root 影响）：**
- `todolist.md` — 进度指针

**<doc_root>/（grill-with-docs 和 superpowers 文档）：**

```
<doc_root>/
├── grillme/
│   ├── <NNNN>-<title>-CONTEXT.md       # grill-with-docs 术语表
│   └── adr/
│       └── <NNNN>-<title>.md           # grill-with-docs ADR
├── superpowers/
│   ├── specs/                          # brainstorming 设计文档
│   │   └── YYYY-MM-DD-<name>-design.md
│   ├── plans/                          # writing-plans 实施计划
│   │   └── YYYY-MM-DD-<name>.md
│   └── archive/                        # 步骤7归档
│       └── YYYY-MM-DD-<name>/
│           ├── specs/
│           └── plans/
```

Skill 默认输出路径会被覆盖为上述结构。

## 会话恢复

1. 读 `todolist.md`
2. 不存在 → 启动决策树（询问 doc_root，从步骤1开始）
3. 存在 + 有 `- [ ]` → 对应步骤继续
4. 存在 + 全 `- [x]` → 检查发布状态 → 提示发布+归档或清理

## 用户绕路处理

用户可能说"直接写代码"、"跳过设计"、"这步不用做了"。处理原则：

| 用户意图 | 处理 |
|---------|------|
| "跳过步骤X" | 说明该步为什么不可跳过（一句话），若用户坚持则记录到 todolist.md 顶部注释 |
| "这步已经做过了" | 验证产物是否存在（如 spec/plan 文档），存在即可跳过 |
| "换个方案" | 回到设计，重新 brainstorming |
| "需求变了" | 回到追问，追加 todolist.md 顶部注释说明变更 |
| 步骤中被打断 | 下次会话通过 todolist.md 恢复，从当前步骤继续 |

## 失败处理

| 步骤 | 触发条件 | 一线修复 | 仍失败兜底 |
|------|---------|---------|-----------|
| 1. 追问 | 需求模糊 | grill-with-docs 自有多轮追问机制 | 超过3轮无结论 → 列出待澄清项让用户逐条确认 |
| 2. 设计 | 方案分歧大 | brainstorming 自有方案对比机制 | 用户不选 → 默认简单方案，记录理由到 todolist.md |
| 3. 拆分 | 任务粒度过大 | writing-plans 要求每步 2-5 分钟 | 仍过大 → 标记需人工拆分 |
| 4. 编码 | 测试写不出 | 先写最小实现让测试通过 | 再逐步加边界，每加一个跑全量；非代码任务跳过 |
| 5. 审查 | Skill("code-review") 发现严重问题 | 修复后重跑 Skill("code-review") | 最多循环 2 次，仍不过 → 标记已知风险，用户决策 |
| 6. 发布 | gf 合并冲突 | 显示冲突文件，等待用户手动解决 | 解决失败 → `git merge --abort`，记录冲突到 todolist.md |
| 7. 归档 | 归档目录已存在 | 追加序号 `-2`、`-3` | 仍冲突 → 手动指定归档名 |

## 🔴 反例（绝不）

| # | 反模式 | 原因 |
|---|--------|------|
| 1 | 跳过人类确认直接写代码 | 方向可能全错 |
| 2 | 不写测试直接写实现 | 没测试 = 不可信 |
| 3 | 步骤未完成就跳下一步 | 技术债叠加 |
| 4 | Skill("code-review") 有 CRITICAL 仍 commit | 生产埋雷 |
| 5 | 跳过追问/设计/拆分直接写代码 | 需求不清 = 必返工 |
| 6 | 追问输出包含技术实现细节 | 追问关注业务需求，技术方案留给设计阶段 |
| 7 | 截断 Skill 的自然产出格式 | 每个 Skill 有自己的输出约定，用 <doc_root> 覆盖路径即可，不要改写内容格式 |
