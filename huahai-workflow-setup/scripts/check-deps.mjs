#!/usr/bin/env node

// huahai-workflow 依赖检测
// 检查 superpowers + grill-me / grill-with-docs

import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const home = homedir();
const skillsDir = join(home, '.claude', 'skills');
const pluginsDir = join(home, '.claude', 'plugins', 'cache');

const checks = [
  {
    name: 'superpowers',
    paths: [join(pluginsDir, 'claude-plugins-official', 'superpowers')],
    install: 'claude plugin install superpowers@superpowers-marketplace',
    desc: 'brainstorming / writing-plans / TDD / debugging',
  },
  {
    name: 'grill-me',
    paths: [join(skillsDir, 'grill-me'), join(home, '.agents', 'skills', 'grill-me')],
    install: 'npx skills@latest add mattpocock/skills -g -y -s grill-me -s grill-with-docs',
    desc: 'mattpocock — 需求追问',
  },
  {
    name: 'grill-with-docs',
    paths: [join(skillsDir, 'grill-with-docs'), join(home, '.agents', 'skills', 'grill-with-docs')],
    install: 'npx skills@latest add mattpocock/skills -g -y -s grill-me -s grill-with-docs',
    desc: 'mattpocock — 文档审查',
  },
];

const failed = checks.filter(c => !c.paths.some(p => existsSync(p)));

if (failed.length === 0) {
  console.log('✅ huahai-workflow 所有依赖已就绪');
  process.exit(0);
}

console.log('');
console.log('══════════════════════════════════════════════');
console.log('  🔧 huahai-workflow 依赖检测');
console.log('══════════════════════════════════════════════');
console.log('');
console.log(`❌ 缺少 ${failed.length} 个依赖：`);
console.log('');
for (const c of failed) {
  console.log(`  📦 ${c.name} — ${c.desc}`);
  console.log(`     → ${c.install}`);
  console.log('');
}
console.log('══════════════════════════════════════════════');
console.log('');
