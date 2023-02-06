import { AddTweetForm } from '~/components/tweets/AddTweetForm';
import { LikeButton } from '~/components/tweets/LikeButton';
import { RepliesButton } from '~/components/tweets/RepliesButton';
import { Tweet } from '~/components/tweets/Tweet';
import TwitterLayout from '~/components/TwitterLayout';

export default function Exercice6() {
  // 🦁 Créer une instance de cookie (https://beta.nextjs.org/docs/api-reference/cookies)
  // 🦁 Récupérer le userId dans les cookies

  // 🦁 Utilise `getTweets` pour récupérer les tweets

  // 💣 Supprime ce placeholder
  const tweets = [] as any[];

  return (
    <TwitterLayout>
      <AddTweetForm />
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet}>
          <RepliesButton count={tweet._count.replies} />
          <LikeButton count={tweet._count.likes} liked={tweet.liked} />
        </Tweet>
      ))}
    </TwitterLayout>
  );
}
