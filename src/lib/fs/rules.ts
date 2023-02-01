import fs from 'fs/promises';
import path from 'path';

const rulesPath = path.join(process.cwd(), '/src/rules');

export const getAllRules = async () => {
  const rules = await fs.readdir(rulesPath);
  return rules.map((r) => r.replace('.md', ''));
};

export const getRule = async (ruleName: string) => {
  const rule = await fs.readFile(
    path.join(rulesPath, `${ruleName  }.md`),
    'utf-8'
  );
  return rule;
};
