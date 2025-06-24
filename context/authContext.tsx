import { onAuthStateChanged, User } from "firebase/auth";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth } from "../firebaseConfig";

interface UserType {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  user: UserType | null;
  login: (userData: UserType) => void;
  logout: () => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
}

type Props = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (userData: UserType) => setUser(userData);
  const logout = () => setUser(null);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      loading,
      setLoading,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
