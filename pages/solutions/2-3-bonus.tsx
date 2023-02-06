import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { Error } from '~/components/Error';
import { Loader } from '~/components/Loader';
import { client } from '~/lib/client/client';
import { AddTweetForm } from '../../src/components/tweets/AddTweetForm';
import { LikeButton } from '../../src/components/tweets/LikeButton';
import { RepliesButton } from '../../src/components/tweets/RepliesButton';
import { Tweet } from '../../src/components/tweets/Tweet';
import TwitterLayout from '../../src/components/TwitterLayout';
import { TweetsScheme } from '../../src/lib/scheme/tweets';

const getTweets = async (signal?: AbortSignal, page = 0) =>
  client(`/api/tweets?page=${page}`, { signal, zodSchema: TweetsScheme });

// Je créer un hooks qui va me permettre d'ajouter un "Observer" à un élément du DOM qui va appelé une fonction lorsque l'élément est visible
const useOnVisible = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) => {
  useEffect(() => {
    if (!ref.current) return;

    // Je récupère l'élément car `ref.current` peut changer entre les renders
    const current = ref.current;

    // Je créer mon observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      },
      { threshold: 0.5 }
    );

    // Je l'observe
    observer.observe(current);

    return () => {
      // J'arrête l'observation si mon hooks est démonté
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

export const NextButton = ({
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: NextButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  // J'utilise mon hooks pour observer le bouton
  // Quand le bouton est visible, je fetch la page suivante
  useOnVisible(ref, fetchNextPage);

  // J'ai déplacer le code de l'exercice précédent ici !
  const nextPageStatus = hasNextPage
    ? 'Loading...'
    : 'There is not more tweets';

  return (
    <button ref={ref} className="block py-4">
      {isFetchingNextPage ? 'Loading more...' : nextPageStatus}
    </button>
  );
};

export default function FetchAllTweets() {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['tweets'],
    queryFn: ({ signal, pageParam }) => getTweets(signal, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error error="Couldn't fetch tweet..." reset={() => refetch()} />;
  }

  const tweets = data.pages.flatMap((page) => page.tweets);

  return (
    <TwitterLayout>
      <AddTweet />
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet}>
          <RepliesButton count={tweet._count.replies} />
          <LikeButton count={tweet._count.likes} liked={tweet.liked} />
        </Tweet>
      ))}
      <NextButton
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </TwitterLayout>
  );
}

const AddTweet = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (content: string) =>
      client('/api/tweets', { method: 'POST', data: { content } }),
    {
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: ['tweets'],
        });
      },
    }
  );

  const handleSubmit = (content: string) => {
    mutation.mutate(content);
  };

  return <AddTweetForm disabled={mutation.isLoading} onSubmit={handleSubmit} />;
};
