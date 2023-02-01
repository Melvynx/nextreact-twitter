import type { User } from '@prisma/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useIsClient, useLocalStorage } from 'usehooks-ts';
import { z } from 'zod';
import { client } from '~/lib/client/client';

type UserContextType = {
  user: User | null;
  logout: () => Promise<void>;
  login: (email: string) => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

const UserScheme = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    username: z.string(),
    displayName: z.string(),
    bio: z.string(),
    avatarUrl: z.string(),
    location: z.string(),
  }),
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage(
    'isAuthenticated',
    false
  );
  const isClient = useIsClient();

  const login = async (email: string) => {
    return client(`/api/auth`, {
      method: 'POST',
      data: {
        email,
      },
      zodSchema: UserScheme,
    }).then((data) => {
      setUser(data.user);
      setIsAuthenticated(true);
    });
  };

  const logout = () => {
    return client(`/api/auth`, {
      method: 'DELETE',
    }).then(() => {
      setIsAuthenticated(false);
      setUser(null);
    });
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!isClient) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    client('/api/user', {
      signal,
      zodSchema: UserScheme,
    })
      .then((json) => setUser(json.user))
      .catch((err) => {
        console.log(err);
      });
  }, [isAuthenticated, isClient]);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
