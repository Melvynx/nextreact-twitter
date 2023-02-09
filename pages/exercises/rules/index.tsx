import type { GetStaticProps } from 'next';
import Link from 'next/link';
import type { Rules } from '~/lib/fs/rules';
// 🦁 Import getAllRules

type RulesProps = {
  rules: Rules;
};

export default function Rules({ rules }: RulesProps) {
  // 💣 Supprime cette ligne
  const ruleDemo = {
    title: 'rule-demo',
    description: 'This is a demo rule',
  };
  return (
    <div className="mt-4 flex flex-col gap-8 p-2">
      <h1 className="text-4xl">Rules</h1>
      <ul className="flex list-disc flex-col gap-2">
        {/* 🦁 Utilise la props `rules` pour afficher les règles */}
        <Link href={`/exercices/rules/${ruleDemo.title}`}>
          <li className="flex flex-col gap-2 rounded border-2 border-gray-900 p-2 capitalize hover:bg-gray-900">
            <span className="text-md text-blue-300">{ruleDemo.title}</span>
            <span className="text-xs text-gray-400">
              {ruleDemo.description}
            </span>
          </li>
        </Link>
      </ul>
    </div>
  );
}

export const getStaticProps: GetStaticProps<RulesProps> = async () => {
  // 🦁 Récupère les règles
  return {
    props: {
      rules: [],
    },
  };
};
