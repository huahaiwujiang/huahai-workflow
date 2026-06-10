#!/usr/bin/env node

// seven-step 依赖检测
// 检查 superpowers + OpenSpec + mattpocock/skills

import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const home = homedir();
const skillsDir = join(home, '.claude', 'skills');
const pluginsDir = join(home, '.claude', 'plugins', 'cache');

// 动态获取 npm 全局路径
let npmRoot = '';
try { npmRoot = execSync('npm root -g', { encoding: 'utf8', timeout: 5000 }).trim(); } catch {}

const checks = [
  {
    name: 'superpowers',
    paths: [join(pluginsDir, 'claude-plugins-official', 'superpowers')],
    install: 'claude plugin install superpowers@superpowers-marketplace',
    desc: 'brainstorming / writing-plans / TDD / debugging',
  },
  {
    name: 'OpenSpec',
    paths: [
      join(home, 'AppData', 'Roaming', 'openspec'),
      npmRoot ? join(npmRoot, '@fission-ai', 'openspec') : '',
    ].filter(Boolean),
    install: 'npm install -g @fission-ai/openspec@latest',
    desc: '/opsx:propose / /opsx:explore / /opsx:archive',
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
  console.log('✅ seven-step 所有依赖已就绪');
  process.exit(0);
}

console.log('');
console.log('══════════════════════════════════════════════');
console.log('  🔧 seven-step 依赖检测');
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
