import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

console.log('[v0] Installing npm dependencies...');

try {
  execSync('npm install', {
    cwd: projectRoot,
    stdio: 'inherit',
  });
  console.log('[v0] Dependencies installed successfully!');
} catch (error) {
  console.error('[v0] Failed to install dependencies:', error.message);
  process.exit(1);
}
