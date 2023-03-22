import type { GetStaticProps } from 'next';
import Link from 'next/link';
import type { Rules } from '~/lib/fs/rules';
import { getAllRules } from '~/lib/fs/rules';

type RulesProps = {
  rules: Rules;
};

export default function Rules({ rules }: RulesProps) {
  return (
    <div className="mt-4 flex flex-col gap-8 p-2">
      <h1 className="text-4xl">Rules</h1>
      <ul className="flex list-disc flex-col gap-2">
        {rules.map((rule) => (
          <Link key={rule.title} href={`/solutions/rules/${rule.title}`}>
            <li className="flex flex-col gap-2 rounded border-2 border-gray-900 p-2 capitalize hover:bg-gray-900">
              <span className="text-md text-blue-300">{rule.title}</span>
              <span className="text-xs text-gray-400">{rule.description}</span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export const getStaticProps: GetStaticProps<RulesProps> = async () => {
  const rules = await getAllRules();
  return {
    props: {
      rules,
    },
  };
};
