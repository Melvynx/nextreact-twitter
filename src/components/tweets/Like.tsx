'use client';

import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

type LikeProps = {
  count: number;
  liked?: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

export const Like = ({ count, onClick, liked, disabled }: LikeProps) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <button
        className="flex flex-row items-center gap-1 hover:brightness-150 disabled:opacity-50"
        onClick={() => onClick?.()}
        disabled={disabled}
      >
        {liked ? (
          <AiFillHeart className="h-4 w-4 text-red-500" />
        ) : (
          <AiOutlineHeart className="h-4 w-4 text-gray-500" />
        )}
        <p className="text-neutral-500">{count}</p>
      </button>
    </div>
  );
};
