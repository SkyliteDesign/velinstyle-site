import { readFileSync, writeFileSync } from 'node:fs';

for (const f of ['index.html', 'scripts/build-expo-home.mjs']) {
  let s = readFileSync(f, 'utf8');
  s = s
    .replaceAll('<velin-counter start="0" end="1280" duration="1200">', '<velin-counter from="0" to="1280" duration="1200">')
    .replaceAll('<velin-counter start="0" end="42" duration="900">', '<velin-counter from="0" to="42" duration="900">');
  writeFileSync(f, s);
  console.log(f, 'start=', (s.match(/velin-counter start=/g) || []).length, 'from=', (s.match(/velin-counter from=/g) || []).length);
}
