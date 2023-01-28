import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '~/hooks/UserProvider';
import { client } from '~/lib/client/client';
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
        if (tweetId) {
          queryClient.invalidateQueries({
            queryKey: ['tweet', tweetId],
          });
          return;
        }
        queryClient.invalidateQueries({
          queryKey: ['tweets'],
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
