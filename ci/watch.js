import { ChildProcess, exec } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { watch } from 'chokidar';

/** @type {ChildProcess} */
let runner;

const __dirname = dirname(fileURLToPath(import.meta.url));

watch(join(__dirname, '..')).on('all', (event, path) => {
  if (path.startsWith(join(__dirname, '..', 'build'))) return;

  if (runner) {
    runner.kill();
    runner.removeAllListeners();
  }
  runner = exec('node ./build.js', { cwd: __dirname });
  runner.on('exit', () => {
    console.log('Build updated');
    runner = undefined;
  });
});
