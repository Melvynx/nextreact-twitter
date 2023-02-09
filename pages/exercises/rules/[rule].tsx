import Markdown from 'markdown-to-jsx';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import type { Rule } from '~/lib/fs/rules';
// 🦁 Importe `getAllRules` et `getRule`
// import { getAllRules, getRule } from '~/lib/fs/rules';

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

export const getStaticPaths: GetStaticPaths = async () => {
  // 🦁 Utilise `getAllRules` pour récupérer toutes les règles

  return {
    // 🦁 Utilise `rules` pour générer les chemins possibles
    paths: [] as any,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  RuleProps
  // 🦁 Ajoute un type pour les paramètres de la route
> = async ({ params }) => {
  if (!params) {
    return {
      notFound: true,
    };
  }

  // 🦁 Récupère le paramètre de la route
  // 🦁 Utilise `getRule` pour récupérer le contenu de la règle

  return {
    props: {
      // 🦁 Ajoute la règle
      rule: undefined as any,
    },
  };
};
