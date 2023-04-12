/* eslint-disable @next/next/no-img-element */
import TwitterLayout from '~/components/TwitterLayout';
import { getUser } from '~/db/users';

export default async function User({
  params,
}: {
  params: {
    userId: string;
  };
}) {
  // 🦁 Récupérer le user
  // 💡 await getUser(params.userId);
  const user = await getUser(params.userId);

  if (!user) {
    return;
  }

  // 🦁 Récupérer le userId dans les cookies
  // 💡 Le nom de notre cookie est `userId`, suis la documentation.
  // 🦁 Créer une instance de cookie (https://beta.nextjs.org/docs/api-reference/cookies)
  const userId = '';

  // 🦁 Définir si le currentUserId est le même que le userId passé en paramètre
  const isCurrentUser = false;

  // 🦁 Regarder si l'utilisateur suit actuellement le user
  // 💡 await isFollowingUser(params.userId, userId);
  const isFollowing = false;

  const followText = isFollowing ? 'Unfollow' : 'Follow';

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
            <button className="ml-auto rounded-full bg-gray-200 py-1 px-2 text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-500">
              {isCurrentUser ? 'Edit' : followText}
            </button>
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
    </TwitterLayout>
  );
}
