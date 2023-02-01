import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '../src/hooks/UserProvider';

export default function Logout() {
  const { user, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      void router.push('/');
      return;
    }
    logout()
      .then(() => {
        void router.push('/login');
      })
      .catch(() => void 0);
  }, [router, user, logout]);

  return <div>Logout processing...</div>;
}
