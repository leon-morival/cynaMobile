import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  user: any;
  setUser: (user: any) => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Load token on mount
  useEffect(() => {
    AsyncStorage.getItem("token").then((storedToken) => {
      if (storedToken) setToken(storedToken);
    });
  }, []);

  useEffect(() => {
    if (token) {
      AsyncStorage.getItem("user").then((storedUser) => {
        if (storedUser) setUser(JSON.parse(storedUser));
      });
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
