'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col gap-4 p-4 bg-orange-500 border border-orange-400 bg-opacity-10">
      <p>Something went wrong!</p>

      <code className="p-2 bg-orange-900">{error.message}</code>

      <button className="p-2 bg-red-800" onClick={() => reset()}>
        Reset error boundary
      </button>
    </div>
  );
}
