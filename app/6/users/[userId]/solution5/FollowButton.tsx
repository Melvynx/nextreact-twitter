'use client';

import { useRouter } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import toast from 'react-hot-toast';
import { client } from '~/lib/client/client';

type FollowButtonProps = PropsWithChildren<{
  userId: string;
  disabled?: boolean;
  isAlreadyFollowing?: boolean;
}>;

const notifyFailed = () => toast.error("Couldn't follow user");
const notifySuccessFollowed = () => toast.success('Followed user');
const notifySuccessUnfollow = () => toast.success('Unfollows user');

export const FollowButton = ({
  userId,
  disabled,
  children,
  isAlreadyFollowing,
}: FollowButtonProps) => {
  const router = useRouter();

  const onFollowing = () => {
    client(`/api/users/${userId}/follow`, {
      method: isAlreadyFollowing ? 'DELETE' : 'POST',
    })
      .then(() => {
        router.refresh();
        isAlreadyFollowing ? notifySuccessUnfollow() : notifySuccessFollowed();
      })
      .catch(() => {
        router.refresh();
        notifyFailed();
      });
  };

  return (
    <button
      disabled={disabled}
      onClick={onFollowing}
      className="ml-auto rounded-full bg-gray-200 py-1 px-2 text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-500"
    >
      {children}
    </button>
  );
};
