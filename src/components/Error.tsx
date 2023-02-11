import type { PropsWithChildren } from 'react';

type ErrorProps = {
  error: string;
  message?: string;
  reset?: () => void;
};

export const Error = ({
  error,
  message,
  reset,
  children,
}: PropsWithChildren<ErrorProps>) => {
  return (
    <div className="flex flex-col gap-4 border border-orange-400 bg-orange-500 bg-opacity-10 p-4">
      <p>{error}</p>

      {message && <p>{message}</p>}

      <button className="bg-red-800 p-2" onClick={() => reset?.()}>
        Retry
      </button>
      {children}
    </div>
  );
};
