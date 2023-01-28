'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AddTweetForm } from '~/components/tweets/AddTweetForm';
import { client } from '~/lib/client/client';

type AddTweetProps = {
  userId?: string;
};

export const AddTweet = ({ userId }: AddTweetProps) => {
  const router = useRouter();
  const mutation = useMutation(
    (content: string) =>
      client('/api/tweets', { method: 'POST', data: { content } }),
    {
      onSuccess: () => {
        // This will get the latest tweets from the server
        router.refresh();
      },
    }
  );

  if (!userId) {
    return <p>Please login to add tweet</p>;
  }

  const handleSubmit = (content: string) => {
    mutation.mutate(content);
  };

  return <AddTweetForm disabled={mutation.isLoading} onSubmit={handleSubmit} />;
};
