import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '~/hooks/UserProvider';
import { client } from '~/lib/client/client';
import { tweetKeys } from '~/lib/tweets/query.tweet';
import { AddTweetForm } from './AddTweetForm';

type AddTweetProps = { tweetId?: string };

export const AddTweet = ({ tweetId }: AddTweetProps) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (content: string) =>
      client('/api/tweets', { method: 'POST', data: { content, tweetId } }),
    {
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: tweetId ? tweetKeys.getById(tweetId) : tweetKeys.all,
        });
      },
    }
  );

  if (!user) {
    return <p>Please login to add tweet</p>;
  }

  const handleSubmit = (content: string) => {
    mutation.mutate(content);
  };

  return <AddTweetForm disabled={mutation.isLoading} onSubmit={handleSubmit} />;
};
