import clsx from 'clsx';
import Link from 'next/link';

type ExerciseProps = {
  number: number;
  solutionCount: number;
  baseUrl?: string;
};

export default function Exercise({
  number,
  solutionCount,
  baseUrl = '',
}: ExerciseProps) {
  // generate an array from 1 to solutionCount
  const solutions = Array.from({ length: solutionCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-2">
      <Link
        className="font-bold text-blue-300 hover:underline"
        href={`/exercises${baseUrl}/${number}`}
      >
        Exercise {number}
      </Link>
      {solutions.map((solution) => (
        <Link
          key={solution}
          href={`/solutions${baseUrl}/${number}-${solution}`}
          className="hover:underline"
        >
          Solution {number} parti {solution}
        </Link>
      ))}
    </div>
  );
}

export const NavigationLink = ({
  href,
  children,
  blue,
}: {
  href: string;
  children: React.ReactNode;
  blue?: boolean;
}) => {
  return (
    <Link
      href={href}
      className={clsx('hover:underline', {
        'font-bold text-blue-300': blue,
      })}
    >
      {children}
    </Link>
  );
};
