'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { useUser } from '../../hooks/UserProvider';
import GrowingTextArea from '../GrowingTextArea';
import { TweetBase } from './Tweet';

type AddTweetFormProps = {
  onSubmit?: (content: string) => void;
  disabled?: boolean;
};

export const AddTweetForm = ({ onSubmit, disabled }: AddTweetFormProps) => {
  const { user } = useUser();
  // For the Growing Text Area we need state to allow auto growing
  const [value, setValue] = useState('');

  if (!user) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit?.(value);

    setValue('');
  };

  return (
    <TweetBase className="border-b-2 border-neutral-700" user={user}>
      <form onSubmit={handleSubmit} className="flex w-full flex-col items-end">
        <GrowingTextArea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="What's happening?"
        ></GrowingTextArea>
        <button
          type="submit"
          className={clsx(
            'mt-4 rounded-full bg-blue-500 px-4 py-2 text-white',
            {
              'cursor-not-allowed opacity-50': disabled,
            }
          )}
        >
          Tweet
        </button>
      </form>
    </TweetBase>
  );
};
