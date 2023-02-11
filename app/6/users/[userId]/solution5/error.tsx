'use client';
import { useRouter } from 'next/navigation';
import { Error } from '~/components/Error';

// Error components must be Client components

export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <Error error="Current user id is wrong is undefined" reset={reset}>
      <button onClick={() => router.back()}>Back</button>
    </Error>
  );
}
