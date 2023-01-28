import { NavigationLink } from '~/components/chore/Navigation';

export default function Index({ tweetId }: { tweetId: string }) {
  return (
    <div className="flex flex-col gap-2">
      <NavigationLink blue href={`/exercises/tweets/${tweetId}/4`}>
        Exercice 4
      </NavigationLink>
      <NavigationLink href={`/solutions/tweets/${tweetId}/4-1`}>
        Solution 4 parti 1
      </NavigationLink>
      <NavigationLink href={`/solutions/tweets/${tweetId}/4-2`}>
        Solution 4 parti 2
      </NavigationLink>
    </div>
  );
}

export const getServerSideProps = async (context: {
  params: { tweetId: string };
}) => {
  const { tweetId } = context.params;

  return {
    props: {
      tweetId,
    },
  };
};
