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

const LikeUpdate = ({
  count,
  liked,
  tweetId,
}: {
  tweetId: string;
  count: number;
  liked?: boolean;
}) => {
  // 🦁 Utilise useQueryClient

  // 🦁 Ajoute un hooks useMutation qui va
  // * utiliser la fonction likeTweet
  // * utilise le paramètre `onMutate` pour mettre à jour le cache
  //   * utilise la même syntaxe que dans mon cours
  //   * invalid le cache de la query `tweets`
  //   * utilise `queryClient.getQueryData` pour récupérer le cache et le stocker dans une variable
  //   * utilise `queryClient.setQueryData` pour mettre à jour le cache en fonction de liked
  // * utilise le paramètre `onError` pour afficher une notification d'erreur et rollback le cache
  //   * tu peux utiliser la fonction `notifyFailed`
  // * utilise le paramètre `onSuccess` pour invalider le cache de la query `tweets`

  return (
    <Like
      count={count}
      onClick={() => {
        // 🦁 Appel la fonction mutate de la mutation
      }}
      liked={liked}
    />
  );
};
