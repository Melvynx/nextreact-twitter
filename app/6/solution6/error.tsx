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
    <div className="flex flex-col gap-4 border border-orange-400 bg-orange-500 bg-opacity-10 p-4">
      <p>Something went wrong!</p>

      <code className="bg-orange-900 p-2">{error.message}</code>

      <button className="bg-red-800 p-2" onClick={() => reset()}>
        Reset error boundary
      </button>
    </div>
  );
}
