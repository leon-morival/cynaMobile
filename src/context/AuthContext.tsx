import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../constants/api";
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
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Si pas d'utilisateur en cache, essayer de le charger depuis l'API
          fetchUserFromApi(token);
        }
      });
    } else {
      setUser(null);
    }
  }, [token]);

  // Fonction pour charger l'utilisateur depuis l'API /me
  const fetchUserFromApi = async (jwtToken: string) => {
    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
      } else {
        setUser(null);
        await AsyncStorage.removeItem("user");
      }
    } catch (e) {
      setUser(null);
      await AsyncStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
