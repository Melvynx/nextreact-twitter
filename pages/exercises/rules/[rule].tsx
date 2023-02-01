import Link from 'next/link';

export default function RulePage({ rule }: { rule: string }) {
  return (
    <div className="prose prose-invert mt-4">
      <Link href="/solutions/rules">Back</Link>
      {/* 🦁 Affiche le markdown à l'aide de notre library */}
    </div>
  );
}

export async function getStaticPaths() {
  // 🦁 Récupère les règles via getAllRules

  return {
    paths: {
      // 🦁 Définit ceci dynamiquement en fonction de nos règles
      params: {
        rule: 'test',
      },
    },
    fallback: false,
  };
}

export async function getStaticProps({
  params: { rule },
}: {
  params: { rule: string };
}) {
  // 🦁 Récupère le contenu de la règle via getRule

  return {
    props: {
      rule: '# Test',
    },
  };
}
