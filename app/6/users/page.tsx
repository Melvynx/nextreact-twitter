import { NavigationLink } from '~/components/chore/Navigation';
import { prisma } from '~/db/prisma';

export default async function Page() {
  const firstUserId = await prisma.user.findFirstOrThrow({
    select: {
      id: true,
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <NavigationLink blue href={`/6/users/${firstUserId.id}/exercice`}>
        Exercice
      </NavigationLink>
      <NavigationLink href={`/6/users/${firstUserId.id}/solution1`}>
        Solution 1
      </NavigationLink>
      <NavigationLink href={`/6/users/${firstUserId.id}/solution2`}>
        Solution 2
      </NavigationLink>
      <NavigationLink href={`/6/users/${firstUserId.id}/solution3`}>
        Solution 3
      </NavigationLink>
      <NavigationLink href={`/6/users/${firstUserId.id}/solution4`}>
        Solution 4
      </NavigationLink>

      <NavigationLink href={`/6/users/${firstUserId.id}/solution5`}>
        Solution 5
      </NavigationLink>
    </div>
  );
}
