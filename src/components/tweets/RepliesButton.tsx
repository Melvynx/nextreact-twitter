import { FaRegComment } from 'react-icons/fa';

type RepliesButtonProps = {
  count: number;
};

export const RepliesButton = ({ count }: RepliesButtonProps) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <button className="flex flex-row items-center gap-2">
        <FaRegComment className="h-4 w-4 text-gray-500" />
        <p className="text-neutral-500">{count}</p>
      </button>
    </div>
  );
};
