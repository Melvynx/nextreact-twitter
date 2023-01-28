'use client';

import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

type LikeProps = { count: number; liked?: boolean; onClick?: () => void };

export const Like = ({ count, onClick, liked }: LikeProps) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <button
        className="flex flex-row items-center gap-1"
        onClick={() => onClick?.()}
      >
        {liked ? (
          <AiFillHeart className="w-4 h-4 text-red-500" />
        ) : (
          <AiOutlineHeart className="w-4 h-4 text-gray-500" />
        )}
        <p className="text-neutral-500">{count}</p>
      </button>
    </div>
  );
};
