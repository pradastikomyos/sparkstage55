import { useAuthContext } from '../contexts/useAuthContext';

export type AppUser = {
  id: string;
  email: string;
  name: string;
};

export function useAuth() {
  const { user, signOut, ...rest } = useAuthContext();

  const appUser: AppUser | null = user
    ? {
        id: user.id,
        email: user.email ?? '',
        name:
          (user.user_metadata?.name as string | undefined) ??
          (user.user_metadata?.full_name as string | undefined) ??
          user.email?.split('@')[0] ??
          '',
      }
    : null;

  return {
    ...rest,
    user: appUser,
    isAuthenticated: Boolean(appUser),
    logout: async () => {
      await signOut();
    },
  };
}
