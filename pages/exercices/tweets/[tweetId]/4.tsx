import type { IncomingMessage } from 'http';
import TwitterLayout from '~/components/TwitterLayout';
import type { TweetView } from '~/lib/scheme/tweets';

export default function TweetId({ tweet }: { tweet: TweetView }) {
  return (
    <TwitterLayout>
      {/* 🦁 Affiche le TweetWithLikes */}
      {/* 🦁 Affiche le composant pour ajouter un Tweet (AddTweet) */}
      {/* 🦁 Affiche les réponses du tweet (tweet.replies), elles sont du même type que Tweet dans le composant TweetWithLikes avec parentTweetId étant tweet.id */}
    </TwitterLayout>
  );
}

export const getServerSideProps = async (context: {
  params: { tweetId: string };
  req: IncomingMessage;
}) => {
  const { tweetId } = context.params;
  // 🦁 Récupère le userId avec la fonction getOptionalUserIdInCookie
  const userId = undefined;

  // 🦁 Récupère le tweet avec la fonction getTweet
  const tweet = undefined;

  return {
    props: {
      // ⚠️ Utilise le trick de JSON pour copier l'objet tweet
      tweet: null,
    },
  };
};
