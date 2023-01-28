import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '../src/hooks/UserProvider';

export default function Logout() {
  const { user, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    logout().then(() => {
      router.push('/login');
    });
  }, [router, user, logout]);

  return <div>Logout processing...</div>;
}
