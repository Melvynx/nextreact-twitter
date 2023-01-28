import Link from 'next/link';
import { getAllRules } from '~/lib/fs/rules';

export default function Rules({ rules }: { rules: string[] }) {
  return (
    <div>
      <h1>Rules</h1>
      <ul className="list-disc">
        {rules.map((rule, index) => (
          <li key={index}>
            <Link
              href={`/solutions/rules/${rule}`} // pour ton exercice c'est /exercices/rules/${rule}
              className="text-blue-300 hover:underline"
            >
              {rule}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticProps = async () => {
  const rules = await getAllRules();
  return {
    props: {
      rules,
    },
  };
};
