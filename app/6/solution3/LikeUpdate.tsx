'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Like } from '~/components/tweets/Like';
import { client } from '~/lib/client/client';

const notifyFailed = () => toast.error("Couldn't like tweet");

const tweetLike = async (tweetId: string, liked: boolean) =>
  client(`/api/tweets/${tweetId}/like`, {
    method: liked ? 'DELETE' : 'POST',
  });

type LikeUpdateProps = {
  tweetId: string;
  count: number;
  liked: boolean;
};

export const LikeUpdate = ({ count, liked, tweetId }: LikeUpdateProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onClick = () => {
    setIsLoading(true);
    tweetLike(tweetId, liked)
      .then(() => {
        router.refresh();
      })
      .catch(() => {
        notifyFailed();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Like
      count={count}
      onClick={() => {
        if (isLoading) {
          return;
        }
        onClick();
      }}
      liked={liked}
    />
  );
};
