const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const filesToPatch = [
  {
    filePath: path.join(root, 'node_modules/react-native-reanimated/lib/module/css/utils/props.js'),
    target: "for (const [prop, value] of Object.entries(style)) {",
    replacement: "for (const [prop, value] of Object.entries(style)) {\n    if (prop.startsWith('unistyles_')) {\n      continue;\n    }"
  },
  {
    filePath: path.join(root, 'node_modules/react-native-reanimated/src/css/utils/props.ts'),
    target: "for (const [prop, value] of Object.entries(style)) {",
    replacement: "for (const [prop, value] of Object.entries(style)) {\n    if (prop.startsWith('unistyles_')) {\n      continue;\n    }"
  }
];

filesToPatch.forEach(({ filePath, target, replacement }) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes("prop.startsWith('unistyles_')")) {
      content = content.replace(target, replacement);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`[Patch] Successfully patched ${path.basename(filePath)}`);
    } else {
      console.log(`[Patch] Already patched ${path.basename(filePath)}`);
    }
  } else {
    console.warn(`[Patch] Warning: File not found at ${filePath}`);
  }
});
