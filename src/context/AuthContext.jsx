import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchCurrentUser = async () => {

      try {

        const response = await api.get("/auth/me");

        setUser(response.data);

      } catch (error) {

        setUser(null);

      } finally {

        setLoading(false);

      }

    };

    fetchCurrentUser();

  }, []);

  const login = async (email, password) => {

  await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  const meResponse = await api.get(
    "/auth/me"
  );

  setUser(meResponse.data);

  return meResponse.data;
};

  const logout = async () => {

    try {

      await api.post("/auth/logout");

      setUser(null);

    } catch (error) {

      console.error(error);

    }

  };

  return (
    <AuthContext.Provider
      value={{
         user,
    setUser,
    loading,
    login,
    logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};