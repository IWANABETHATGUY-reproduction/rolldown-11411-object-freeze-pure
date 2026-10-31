// Builds cases/issue-repro with Rolldown: without a plugin, with plugin.mjs
// (oxc-parser + magic-string), and with plugin-native.mjs (`this.parse` +
// native MagicString). Writes results.md.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { rolldown, VERSION } from 'rolldown';
import { pureObjectFreeze } from './plugin.mjs';
import { pureObjectFreezeNative } from './plugin-native.mjs';

const root = import.meta.dirname;

async function build(plugins, experimental) {
  const bundle = await rolldown({
    input: join(root, 'cases/issue-repro/main.js'),
    cwd: root,
    plugins,
    experimental,
  });
  const { output } = await bundle.generate({ format: 'es', sourcemap: true });
  await bundle.close();
  return output[0].code;
}

const builds = {
  'Without a plugin': await build([]),
  'plugin.mjs (oxc-parser + magic-string)': await build([pureObjectFreeze()]),
  'plugin-native.mjs (this.parse + nativeMagicString)': await build([pureObjectFreezeNative()], {
    nativeMagicString: true,
  }),
};

let md = `# rolldown ${VERSION}\n`;
for (const [label, code] of Object.entries(builds)) {
  const status = code.includes('RuleB') ? 'RuleB kept' : 'RuleB removed';
  md += `\n## ${label}: ${status}\n\n\`\`\`js\n${code.trimEnd()}\n\`\`\`\n`;
  console.log(`${label}: ${status}`);
}
writeFileSync(join(root, 'results.md'), md);
