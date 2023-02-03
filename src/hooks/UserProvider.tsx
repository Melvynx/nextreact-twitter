import type { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import { useLocalStorage } from 'usehooks-ts';
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
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage(
    'isAuthenticated',
    false
  );

  const { data, remove } = useQuery({
    queryKey: ['user'],
    queryFn: () => client('/api/user', { zodSchema: UserScheme }),
    enabled: isAuthenticated,
  });

  const user = data?.user ?? null;

  const login = async (email: string) => {
    return client(`/api/auth`, {
      method: 'POST',
      data: {
        email,
      },
      zodSchema: UserScheme,
    }).then(() => {
      setIsAuthenticated(true);
    });
  };

  const logout = () => {
    return client(`/api/auth`, {
      method: 'DELETE',
    }).then(() => {
      setIsAuthenticated(false);
      remove();
    });
  };

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
