import Markdown from 'markdown-to-jsx';
import Link from 'next/link';
import { getAllRules, getRule } from '~/lib/fs/rules';

export default function RulePage({ rule }: { rule: string }) {
  return (
    <div className="prose prose-invert mt-4">
      <Link href="/solutions/rules">Back</Link>
      <Markdown>{rule}</Markdown>
    </div>
  );
}

export async function getStaticPaths() {
  const rules = await getAllRules();

  return {
    paths: rules.map((rule) => ({
      params: {
        rule, // pour /rules/[rule]
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({
  params: { rule },
}: {
  params: { rule: string };
}) {
  const ruleContent = await getRule(rule);

  return {
    props: {
      rule: ruleContent,
    },
  };
}
