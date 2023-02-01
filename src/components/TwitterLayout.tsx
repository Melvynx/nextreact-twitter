/* eslint-disable @next/next/no-img-element */
import type { PropsWithChildren } from 'react';

const TwitterLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-screen flex-col divide-y divide-neutral-700">
      {children}
    </div>
  );
};

export default TwitterLayout;
