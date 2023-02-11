import { prisma } from './prisma';

export const getUser = (userId: string) =>
  prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      avatarUrl: true,
      bio: true,
      location: true,
      email: true,
      id: true,
      displayName: true,
      username: true,
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  });

export const isFollowingUser = async (
  userId: string,
  currentUserId: string
) => {
  const following = await prisma.userFollowsUser.findFirst({
    where: {
      followerId: userId,
      followingId: currentUserId,
    },
  });

  return Boolean(following);
};
