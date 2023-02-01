import { toast } from 'react-hot-toast';
import { Error } from '~/components/Error';
import { Loader } from '~/components/Loader';
import { AddTweet } from '~/components/tweets/AddTweet';
import { TweetsNextButton } from '~/components/tweets/TweetsNextButton';
import { useInfiniteTweets } from '~/lib/tweets/query.tweet';
import { Like } from '../../src/components/tweets/Like';
import { Replies } from '../../src/components/tweets/Replies';
import { Tweet } from '../../src/components/tweets/Tweet';
import TwitterLayout from '../../src/components/TwitterLayout';

export default function OptimisticUpdate() {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
  } = useInfiniteTweets();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error error="Couldn't fetch tweet..." reset={() => refetch()} />;
  }

  const tweets = data.pages.flatMap((page) => page.tweets);

  return (
    <TwitterLayout>
      <AddTweet />
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet}>
          <Replies count={tweet._count.replies} />
          <LikeUpdate
            tweetId={tweet.id}
            liked={tweet.liked}
            count={tweet._count.likes}
          />
        </Tweet>
      ))}
      <TweetsNextButton
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </TwitterLayout>
  );
}

const notifyFailed = () => toast.error("Couldn't like tweet");

const likeTweet = async (tweetId: string, liked: boolean) => {
  // 🦁 Utilise `client` pour faire un appel à l'API
  // url : `/api/tweets/${tweetId}/like`
  // la method sera DELETE si liked est true, POST sinon
  // data : { userId }
  return 'todo';
};

type LikeUpdateProps = {
  tweetId: string;
  count: number;
  liked: boolean;
};

const LikeUpdate = ({ count, liked, tweetId }: LikeUpdateProps) => {
  // 🦁 Créer un state isLoading
  // 🦁 Utilise useQueryClient

  // 🦁 Ajoute la fonction onClick
  // * met isLoading à true
  // * utiliser la fonction likeTweet
  // * si c'est un succès (`.then`) : invalidé la query des tweets (tu pourras trouver la clé dans [query.tweet.ts](src/lib/tweets/query.tweet.ts) et l'importer)
  // * si c'est un échec (`.catch`) : affiché un message d'erreur
  // * finalement (`.finally`) on va définir le state `isLoading` à false et le mettre à true pendant

  return (
    <Like
      count={count}
      onClick={() => {
        // 🦁 Appel la fonction onClick
      }}
      liked={liked}
    />
  );
};
