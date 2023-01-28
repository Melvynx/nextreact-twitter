'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { useUser } from '../../hooks/UserProvider';
import GrowingTextArea from '../GrowingTextArea';
import { TweetBase } from './Tweet';

export const AddTweetForm = ({
  onSubmit,
  disabled,
}: {
  onSubmit?: (content: string) => void;
  disabled?: boolean;
}) => {
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
    <TweetBase user={user}>
      <form onSubmit={handleSubmit} className="flex flex-col items-end w-full">
        <GrowingTextArea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="What's happening?"
        ></GrowingTextArea>
        <button
          type="submit"
          className={clsx('px-4 py-2 mt-4 text-white bg-blue-500 rounded-full', {
            'opacity-50 cursor-not-allowed': disabled,
          })}
        >
          Tweet
        </button>
      </form>
    </TweetBase>
  );
};
