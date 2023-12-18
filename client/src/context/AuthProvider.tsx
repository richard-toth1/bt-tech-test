import { createContext, useState, ReactNode } from "react";

export interface AuthContextData {
  username?: string;
  token?: string;
  roles?: string[];
}

export interface AuthContextProps {
  auth: AuthContextData,
  setAuth: (data: AuthContextData) => void
}

const AuthContext = createContext<AuthContextProps>(null!);

export const AuthProvider = ({ children } : {children: ReactNode}) => {
  const [auth, _setAuth] = useState<AuthContextData>(() => {
    const persistedAuth = localStorage.getItem('auth');
    return persistedAuth ? JSON.parse(persistedAuth) : {};
  });

  const setAuth = (data: AuthContextData) => {
    _setAuth(data);
    localStorage.setItem('auth', JSON.stringify(data));
  }

  return (
      <AuthContext.Provider value={{ auth, setAuth }}>
          {children}
      </AuthContext.Provider>
  )
}

export default AuthContext;