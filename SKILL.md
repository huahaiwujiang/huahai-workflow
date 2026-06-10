---
name: seven-step
description: 7步工作流 — 从追问到发布的完整开发链路。内置 gf git 流程管理。AI启动时自动加载，每个对话都必须遵守。
---

# 7 步工作流

> superpowers 管思考，OpenSpec 管规格，Matt Pocock 管追问，内置命令管审查。

## 开工铁律

**AI 在说任何话之前，必须先读项目根目录的 `todolist.md`。**

1. 读到 → 检查"当前步骤" → 从该步骤开始，不得跳步
2. 没读到 → 在项目根目录创建 `todolist.md`，并确保 `todolist.md` 已加入 `.gitignore`，然后询问用户："要开始新功能吗？还是继续之前的工作？"
3. 上一步未完成时跳过它直接写代码 = 违规

## 7 步链路

```
步骤1: 追问  → grill-with-docs                "基于文档追问，对齐理解"
步骤2: 规格  → /opsx:propose                  "写成规格文档"
步骤3: 设计  → superpowers:brainstorming      "技术怎么实现？"
      🔴 CHECKPOINT: 展示方案 → 等待人类确认 → 继续
步骤4: 拆分  → superpowers:writing-plans      "拆成几步？"
步骤5: 编码  → superpowers:test-driven-development  "RED → GREEN → REFACTOR"
步骤6: 审查  → /review + /security-review      "代码对不对？安全吗？"
      🔴 CHECKPOINT: 检查清单全通过才能 commit
步骤7: 发布  → gf + /opsx:archive              "提交 + 归档"
```

## 路由裁决表

| 任务 | 工具 |
|------|------|
| 追问需求细节 | `grill-with-docs` skill |
| 把需求写成规格 | `/opsx:propose` |
| 方案设计 | `superpowers:brainstorming` |
| **人类确认** | **展示方案 → 等待"可以"（铁律）** |
| 写实施计划 | `superpowers:writing-plans` |
| 写代码（TDD） | `superpowers:test-driven-development` |
| 并行任务执行 | `superpowers:subagent-driven-development` |
| 调试 bug | `superpowers:systematic-debugging` |
| 文档审查 | `grill-with-docs` skill |
| 代码审查 | `/review` |
| 安全审查 | `/security-review` |
| 完成前自检 | `superpowers:verification-before-completion` |
| 收尾分支 | `superpowers:finishing-a-development-branch` |
| Git 提交/合并 | `gf` skill |
| 归档 | `/opsx:archive` |

## 🔴 CHECKPOINT 门禁

### 🔴 CHECKPOINT 步骤3→4：人类确认
方案设计完成后，必须向用户展示方案并等待明确确认，才能进入计划拆分。
未获确认 = 🛑 STOP，禁止进入步骤4/5。

### 🔴 CHECKPOINT 步骤6→7：提交前检查清单
- [ ] TDD 测试通过
- [ ] /review 已通过，无严重问题
- [ ] /security-review 已通过（auth/finance/system 模块）
- [ ] 文档反写：改了什么文档就同步了什么
- [ ] todolist.md 中对应任务已勾选

全部通过 = 可以提交。任一未通过 = 🛑 STOP，先补该项。

## 会话恢复

1. 读 `todolist.md` → 找第一个未勾选任务
2. 读 `git log -1` → 确认上次提交
3. 从第一个未完成步骤继续

## 安全规范

### 提交前安全检查
- [ ] 无硬编码密钥（API Key、密码、Token）
- [ ] 所有用户输入已校验
- [ ] SQL 注入防护（参数化查询）
- [ ] XSS 防护（输出转义）
- [ ] 身份认证/授权已验证
- [ ] 错误消息不泄露敏感数据

### 常见漏洞防范
| 漏洞 | 防范方式 |
|------|----------|
| SQL 注入 | ORM / 参数化查询 |
| XSS | 输出转义、CSP 头 |
| CSRF | SameSite Cookie、CSRF Token |
| IDOR (越权) | 每次操作验证资源所有权 |
| 敏感数据泄露 | 日志脱敏、错误信息泛化 |

## 测试规范

### 最低覆盖率：80%
- TDD 铁律：没有失败测试前不写实现代码
- RED → GREEN → REFACTOR

### 命名规范
```
{filename}.test.ts          # 单元/集成测试
{filename}.spec.ts          # E2E 测试
it('should {expected} when {condition}')
```

### 反模式（禁止）
- ❌ 使用 any 绕过类型检查
- ❌ 测试实现细节而非行为
- ✅ 测试公开行为

## 失败处理（每步 fallback）

| 步骤 | 失败场景 | 处理方式 |
|------|---------|---------|
| 1. 追问 | 用户问题太模糊、回答不清 | 追问 3 轮后仍无结论 → 继续追问直到用户给出确定答案 |
| 2. 规格 | OpenSpec 不可用 | 手动创建 `openspec/changes/<name>/`，手写 proposal.md |
| 3. 设计 | 方案选择分歧大 | 列出 2 个对比方案的优劣，让用户选一个；用户不选则默认简单方案 |
| 4. 拆分 | 任务粒度太大 | 继续拆到每个任务 ≤5 分钟、单文件可完成 |
| 5. 编码 | 测试写不出/跑不过 | 先写最小实现让测试通过，再逐步加边界；不跳过 TDD |
| 6. 审查 | /review 发现严重问题 | 修完问题后重新跑 /review，最多循环 2 次 |
| 7. 发布 | gf 合并冲突 | 显示冲突文件 → 用户手动解决 → 回复"完成"后继续 |

## 🔴 反例黑名单（不要做的事）

| # | 反模式 | 为什么不要做 |
|---|--------|-------------|
| 1 | **跳过人类确认直接写代码** | 方案没对齐，写完发现方向错了 |
| 2 | **没有 TDD 直接写实现** | 没有测试的代码 = 不可信的代码 |
| 3 | **步骤没完成就跳到下一步** | 欠的技术债下一步加倍偿还 |
| 4 | **/review 有 CRITICAL 仍然 commit** | 带病上线 = 生产环境埋雷 |
| 5 | **gf 合并不确认目标分支就执行** | 可能误合到错误分支 |
| 6 | **跳过步骤1-2 直接写代码** | 需求不清就动手 = 必返工 |
| 7 | **硬编码密钥/密码** | 代码泄露 = 安全事故 |

