import { useEffect, useRef } from 'react';

const useOnVisible = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) => {
  useEffect(() => {
    if (!ref.current) return;

    const current = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(current);

    return () => {
      observer.unobserve(current);
    };
  }, [ref, callback]);

  return ref;
};

type NextButtonProps = {
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
  fetchNextPage: () => void;
};

export const TweetsNextButton = ({
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: NextButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  useOnVisible(ref, fetchNextPage);

  const nextPageStatus = hasNextPage
    ? 'Loading...'
    : 'There is not more tweets';

  return (
    <button ref={ref} className="block py-4">
      {isFetchingNextPage ? 'Loading more...' : nextPageStatus}
    </button>
  );
};
