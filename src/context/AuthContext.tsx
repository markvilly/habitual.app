import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthResponse } from "../types";

interface AuthContextType {
  user: AuthResponse | null;
  setUser: (user: AuthResponse | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("user")
      .then((value) => {
        if (value) setUserState(JSON.parse(value));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const setUser = (u: AuthResponse | null) => {
    setUserState(u);
    if (u) {
      AsyncStorage.setItem("user", JSON.stringify(u));
    } else {
      AsyncStorage.removeItem("user");
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
