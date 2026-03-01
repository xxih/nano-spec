import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('🔨 Building nano-spec...');

// 1. 清理 dist 目录，避免旧产物残留在发布包中
console.log('  → Cleaning dist directory...');
try {
  fs.removeSync(distDir);
  fs.ensureDirSync(distDir);
  console.log('  ✓ Dist directory cleaned');
} catch (error) {
  console.error('  ✗ Failed to clean dist directory:', error.message);
  process.exit(1);
}

// 2. 编译 TypeScript
console.log('  → Compiling TypeScript...');
try {
  execSync('tsc', { stdio: 'inherit', cwd: rootDir });
  console.log('  ✓ TypeScript compilation complete');
} catch (error) {
  console.error('  ✗ TypeScript compilation failed');
  process.exit(1);
}

// 3. 复制 static 目录到 dist
console.log('  → Copying static files...');
try {
  const staticSrc = path.join(rootDir, 'src', 'static');
  const staticDest = path.join(distDir, 'static');
  fs.copySync(staticSrc, staticDest, { overwrite: true });
  console.log('  ✓ Static files copied');
} catch (error) {
  console.error('  ✗ Failed to copy static files:', error.message);
  process.exit(1);
}

// 4. 复制 presets 目录到 dist
console.log('  → Copying presets...');
try {
  const presetsSrc = path.join(rootDir, 'src', 'presets');
  const presetsDest = path.join(distDir, 'presets');
  fs.copySync(presetsSrc, presetsDest, { overwrite: true });
  console.log('  ✓ Presets copied');
} catch (error) {
  console.error('  ✗ Failed to copy presets:', error.message);
  process.exit(1);
}

console.log('\n✅ Build complete!');
