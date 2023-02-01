type ErrorProps = {
  error: string;
  message?: string;
  reset?: () => void;
};

export const Error = ({ error, message, reset }: ErrorProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-orange-500 border border-orange-400 bg-opacity-10">
      <p>{error}</p>

      {message && <p>{message}</p>}

      <button className="p-2 bg-red-800" onClick={() => reset?.()}>
        Retry
      </button>
    </div>
  );
};
