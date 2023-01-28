import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { useUser } from '../hooks/UserProvider';

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col max-w-lg min-h-full m-auto">
      <header className="flex items-center justify-between gap-2 p-2 border-b border-b-gray-700">
        <Link href="/" className="text-2xl font-bold text-blue-300">
          Twitter
        </Link>
        <User />
      </header>
      <div className="h-full">{children}</div>
    </div>
  );
};

const User = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <Link href="/login" className="text-blue-300">
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <p className="text-xs text-neutral-300">{user.email}</p>
      <Link href="/logout" className="text-blue-300">
        Logout
      </Link>
    </div>
  );
};
