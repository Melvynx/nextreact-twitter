import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Loader } from '~/components/Loader';
import { AddTweet } from '~/components/tweets/AddTweet';
import { client } from '~/lib/client/client';
import { Like } from '../../src/components/tweets/Like';
import { Replies } from '../../src/components/tweets/Replies';
import { Tweet } from '../../src/components/tweets/Tweet';
import TwitterLayout from '../../src/components/TwitterLayout';
import { TweetsScheme } from '../../src/lib/scheme/tweets';

const getTweets = async (signal?: AbortSignal, userId?: string) =>
  client(`/api/tweets`, { signal, zodSchema: TweetsScheme });

export default function FetchAllTweets() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tweets'],
    queryFn: ({ signal }) => getTweets(signal),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <p>An error occurred.</p>;
  }

  const tweets = data.tweets;

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
    </TwitterLayout>
  );
}

const notifyFailed = () => toast.error("Couldn't like tweet");

const tweetLike = async (tweetId: string, liked: boolean) => {
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
  //   * utilise `queryClient.getQueryData` pour récupérer le cache et le stoquer dans une variable
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
