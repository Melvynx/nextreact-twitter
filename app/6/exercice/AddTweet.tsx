// 🦁 Ajoute la string "use client"

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddTweetForm } from '~/components/tweets/AddTweetForm';
import { useUser } from '~/hooks/UserProvider';
import { client } from '~/lib/client/client';

type AddTweetProps = {
  // 🦁 Ajoute un paramètre `userId` de type `string`
};

// Pour l'exercice 6.2
export const AddTweet = ({}: AddTweetProps) => {
  // 💣 Supprime ce hooks, on récupère le user dans les props
  const { user } = useUser();

  // 💣 Supprime ce hooks, on utilise pas queryClient ici
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (content: string) =>
      client('/api/tweets', { method: 'POST', data: { content } }),
    {
      onSuccess: () => {
        // 🦁 Utilise router.refresh() (https://beta.nextjs.org/docs/api-reference/use-router)
      },
    }
  );

  // 🦁 Remplace par `(!userId)`
  if (!user) {
    return <p>Please login to add tweet</p>;
  }

  const handleSubmit = (content: string) => {
    mutation.mutate(content);
  };

  return <AddTweetForm disabled={mutation.isLoading} onSubmit={handleSubmit} />;
};
