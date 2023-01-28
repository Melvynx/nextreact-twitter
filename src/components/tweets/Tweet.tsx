/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Fragment, PropsWithChildren } from 'react';
import { TlTweet } from '~/lib/scheme/tweets';
import { formatDate } from '../../lib/date/formatDate';

type TweetProps = {
  tweet: TlTweet;
};

export const Tweet = ({ tweet, children }: PropsWithChildren<TweetProps>) => {
  return (
    <TweetBase tweetId={tweet.id} user={tweet.user} createdAt={tweet.createdAt}>
      <p className="text-sm text-gray-300">{tweet.content}</p>
      <div className="flex flex-row gap-6">{children}</div>
    </TweetBase>
  );
};

type TweetBaseProps = {
  user: TlTweet['user'];
  createdAt?: string;
  tweetId?: string;
};

export const TweetBase = ({
  user,
  createdAt,
  children,
  tweetId,
}: PropsWithChildren<TweetBaseProps>) => {
  const LinkComponent = tweetId ? Link : Fragment;
  const props = tweetId ? { href: `/routing/tweets/${tweetId}` } : ({} as any);
  return (
    <div className="flex flex-row items-start w-full p-4">
      <img
        src={user.avatarUrl ?? ''}
        alt="user"
        className="w-10 h-10 rounded-full"
      />
      <div className="flex flex-col w-full gap-2 ml-4">
        <LinkComponent {...props}>
          <div className="flex flex-row items-center gap-2">
            <p className="text-base text-neutral-100">{user.displayName}</p>
            <p className="text-sm text-gray-500">@{user.username}</p>
            <p className="text-sm text-gray-500">·</p>
            {createdAt && (
              <p className="text-sm text-gray-500">
                {formatDate(new Date(createdAt))}
              </p>
            )}
          </div>
        </LinkComponent>
        {children}
      </div>
    </div>
  );
};
