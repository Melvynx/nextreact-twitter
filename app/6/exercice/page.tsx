import { AddTweetForm } from '~/components/tweets/AddTweetForm';
import { Like } from '~/components/tweets/Like';
import { Replies } from '~/components/tweets/Replies';
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
          <Replies count={tweet._count.replies} />
          <Like count={tweet._count.likes} liked={tweet.liked} />
        </Tweet>
      ))}
    </TwitterLayout>
  );
}
