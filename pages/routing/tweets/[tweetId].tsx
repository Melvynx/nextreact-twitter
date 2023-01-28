import Exercise from '~/components/chore/Navigation';

export default function Index({ tweetId }: { tweetId: string }) {
  return (
    <div className="mt-4">
      <Exercise baseUrl={`/tweets/${tweetId}`} number={4} solutionCount={2} />
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
