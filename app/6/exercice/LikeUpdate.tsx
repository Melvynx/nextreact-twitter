// 🦁 Ajoute "use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import { LikeButton } from '~/components/tweets/LikeButton';
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

  const onClick = () => {
    setIsLoading(true);
    tweetLike(tweetId, liked)
      .then(() => {
        // 🦁 Utilise `router.refresh()` pour mettre à jour les tweets
      })
      .catch(() => {
        notifyFailed();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <LikeButton
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
