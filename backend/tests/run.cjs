// Compile test imports in memory; no build artifacts or database migrations.
const fs = require('node:fs');
const path = require('node:path');
const { transformSync } = require('esbuild');
require.extensions['.ts'] = (module, filename) => {
  const { code: outputText } = transformSync(fs.readFileSync(filename, 'utf8'), {
    loader: 'ts', format: 'cjs', target: 'es2022', sourcefile: filename,
  });
  module._compile(outputText, filename);
};
for (const file of fs.readdirSync(__dirname).filter(file => file.endsWith('.test.ts'))) {
  require(path.join(__dirname, file));
}
