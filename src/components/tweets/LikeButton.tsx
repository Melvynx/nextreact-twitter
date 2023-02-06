'use client';

import clsx from 'clsx';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

type LikeButtonProps = {
  count: number;
  liked?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export const LikeButton = ({
  count,
  onClick,
  liked,
  disabled,
  loading,
}: LikeButtonProps) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <button
        className={clsx(
          'flex flex-row items-center gap-1 hover:brightness-150 disabled:opacity-50',
          {
            'opacity-80': loading,
          }
        )}
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
