import clsx from 'clsx';
import { useEffect, useRef } from 'react';

const GrowingTextArea = ({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  disabled?: boolean;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaRef.current) {
      return;
    }
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={clsx('w-full resize-none bg-transparent focus:outline-none', {
        'text-gray-500': disabled,
      })}
    />
  );
};

export default GrowingTextArea;
