import { useInfiniteQuery } from '@tanstack/react-query';
import { client } from '../client/client';
import { TweetsScheme } from '../scheme/tweets';

export const tweetKeys = {
  all: ['tweets'],
  getById: (id: string) => ['tweet', id],
  getByUser: (id: string) => ['tweets', 'user', id],
};

const getTweets = async (signal?: AbortSignal, page = 0) =>
  client(`/api/tweets?page=${page}`, { signal, zodSchema: TweetsScheme });

export const useInfiniteTweets = () =>
  useInfiniteQuery({
    queryKey: tweetKeys.all,
    queryFn: ({ signal, pageParam }) => getTweets(signal, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
