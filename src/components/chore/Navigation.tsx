import clsx from 'clsx';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';

type ExerciseProps = {
  number: number;
  solutionCount: number;
  baseUrl?: string;
};

export default function Exercise({
  number,
  solutionCount,
  baseUrl = '',
  children,
}: PropsWithChildren<ExerciseProps>) {
  // generate an array from 1 to solutionCount
  const solutions = Array.from({ length: solutionCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-2">
      <Link
        className="font-bold text-blue-300 hover:underline"
        href={`/exercices${baseUrl}/${number}`}
      >
        Exercise {number}
      </Link>
      {solutions.map((solution) => (
        <SolutionLink
          key={solution}
          number={number}
          solution={String(solution)}
          baseUrl={baseUrl}
        />
      ))}
      {children}
    </div>
  );
}

type SolutionLinkProps = {
  number: number;
  solution: string;
  baseUrl?: string;
};

export const SolutionLink = ({
  number,
  solution,
  baseUrl = '',
}: SolutionLinkProps) => (
  <Link
    key={solution}
    href={`/solutions${baseUrl}/${number}-${solution}`}
    className="hover:underline"
  >
    Solution {number} parti {solution}
  </Link>
);

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
