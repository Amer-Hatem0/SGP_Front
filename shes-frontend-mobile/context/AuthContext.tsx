import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import useAuth from '../hooks/useAuth';

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  const memoizedValue = useMemo(() => auth, [
    auth.user,
    auth.loading,
    auth.tokenData,
    auth.isAuthenticated,
  ]);

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used inside AuthProvider');
  return context;
};
