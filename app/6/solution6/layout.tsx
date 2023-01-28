import { PropsWithChildren } from 'react';
import TwitterLayout from '~/components/TwitterLayout';

export default function layout({ children }: PropsWithChildren) {
  return <TwitterLayout>{children}</TwitterLayout>;
}
