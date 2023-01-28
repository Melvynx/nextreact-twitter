import Link from 'next/link';
// 🦁 Décommente la ligne suivante
// import { getAllRules } from '~/lib/fs/rules';

export default function Rules({ rules }: { rules: string[] }) {
  // 💣 Supprime la ligne suivante
  const rule = 'test';
  return (
    <div>
      <h1>Rules</h1>
      <ul className="list-disc">
        {/* 🦁 Remplace ceci par nos règles */}
        <li>
          <Link
            href={`/exercices/rules/${rule}`}
            className="text-blue-300 hover:underline"
          >
            {rule}
          </Link>
        </li>
      </ul>
    </div>
  );
}

export const getStaticProps = async () => {
  // 🦁 Récupère les rules via getAllRules
  return {
    props: {
      rules: [],
    },
  };
};
