/* eslint-disable @next/next/no-img-element */
import { cookies } from 'next/headers';
import { TweetWithLikes } from '~/components/tweets/TweetWithLikes';
import TwitterLayout from '~/components/TwitterLayout';
import { getUserTweets } from '~/db/tweets';
import { getUser, isFollowingUser } from '~/db/users';
import { FollowButton } from './FollowButton';

export default async function User({
  params,
}: {
  params: {
    userId: string;
  };
}) {
  const user = await getUser(params.userId);
  const nextCookies = cookies();
  const userIdCookie = nextCookies.get('userId');
  const currentUserId = userIdCookie?.value ?? '';

  const isCurrentUser = currentUserId === params.userId;

  const isFollowing = await isFollowingUser(params.userId, currentUserId);
  const followText = isFollowing ? 'Unfollow' : 'Follow';

  const tweets = await getUserTweets(params.userId, currentUserId);

  return (
    <TwitterLayout>
      <div className="flex items-center">
        <img
          src={user.avatarUrl ?? ''}
          alt={user.displayName ?? 'profile picture'}
          className="relative h-32 w-32 rounded-full border-2 border-gray-100"
        />
        <div className="m-4 flex flex-col">
          <div className="flex items-center">
            <h2 className="text-xl">{user.displayName}</h2>
            <FollowButton
              userId={params.userId}
              disabled={isCurrentUser}
              isAlreadyFollowing={isFollowing}
            >
              {isCurrentUser ? 'Edit' : followText}
            </FollowButton>
          </div>
          <p className="text-base text-gray-500">@{user.username}</p>
          <p className="mt-2 text-xs">🎙️ {user.bio}</p>
          <p className="mt-1 text-xs text-gray-500">📍 {user.location}</p>
          <div className="flex gap-4">
            <p className="mt-1 text-sm text-gray-500">
              <b>{user._count.followers}</b> followers
            </p>
            <p className="mt-1 text-sm text-gray-500">
              <b>{user._count.following}</b> following
            </p>
          </div>
        </div>
      </div>
      <h2 className="p-4 text-xl font-bold">Tweets</h2>
      {tweets.map((tweet) => (
        <TweetWithLikes key={tweet.id} tweet={tweet} />
      ))}
    </TwitterLayout>
  );
}
