import { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: any;
  session: any;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  const fakeUser = {
    id: "local-admin",
    email: "admin@local.com"
  };

  const signIn = async (email: string, password: string) => {
    if (email === "admin@local.com" && password === "123456") {
      return { error: null };
    }
    return { error: new Error("Credenciais inválidas") };
  };

  const signOut = async () => {};

  return (
    <AuthContext.Provider value={{
      user: fakeUser,
      session: null,
      isAdmin: true,
      loading: false,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
