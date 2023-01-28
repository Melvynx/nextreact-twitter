/* eslint-disable @next/next/no-img-element */
import { PropsWithChildren } from 'react';

const TwitterLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col h-screen divide-y divide-neutral-700">
      {children}
    </div>
  );
};

export default TwitterLayout;
