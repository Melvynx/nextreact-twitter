import fm from 'front-matter';
import fs from 'fs/promises';
import path from 'path';

const rulesPath = path.join(process.cwd(), '/src/rules');

type RuleFrontMatter = {
  description: string;
};

export type Rules = {
  description: string;
  title: string;
}[];

export type Rule = {
  body: string;
  attributes: RuleFrontMatter;
};

const getRuleContent = async (filename: string) => {
  const rule = await fs.readFile(path.join(rulesPath, filename), 'utf-8');

  const frontmatter = fm<RuleFrontMatter>(rule);

  return frontmatter;
};

export const getAllRules = async () => {
  const rules = await fs.readdir(rulesPath);
  return Promise.all(
    rules.map(async (rule) => {
      const content = await getRuleContent(rule);
      return {
        description: content.attributes.description,
        title: rule.replace('.md', ''),
      };
    })
  );
};

export const getRule = async (ruleName: string) => {
  return getRuleContent(`${ruleName}.md`);
};
