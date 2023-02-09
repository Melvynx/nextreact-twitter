import Markdown from 'markdown-to-jsx';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import type { Rule } from '~/lib/fs/rules';
import { getAllRules, getRule } from '~/lib/fs/rules';

type RuleProps = {
  rule: Rule;
};

export default function RulePage({ rule }: RuleProps) {
  return (
    <div className="prose prose-invert mt-4 p-2">
      <Link href="/solutions/rules">Back</Link>
      <Markdown>{rule.body}</Markdown>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths<{ rule: string }> = async () => {
  const rules = await getAllRules();

  return {
    paths: rules.map((rule) => ({
      params: {
        rule: rule.title,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  RuleProps,
  { rule: string }
> = async ({ params }) => {
  if (!params) {
    return {
      notFound: true,
    };
  }

  const rule = params.rule;
  const ruleContent = await getRule(rule);

  return {
    props: {
      rule: ruleContent,
    },
  };
};
