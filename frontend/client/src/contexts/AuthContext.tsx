import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@shared/routes";
import { apiPost } from "@/lib/api";

interface User {
  id: number;
  fullName: string;
  mobile: string;
  email?: string;
  city?: string | null;
  country?: string | null;
  profilePicture?: string | null;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  login: (mobile: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage or session)
    const storedUser = localStorage.getItem("fintrack_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        ...parsedUser,
        city: parsedUser.city || null,
        country: parsedUser.country || null,
        profilePicture: parsedUser.profilePicture || null,
      });
    }
    setLoading(false);
  }, []);

  const login = async (mobile: string, password: string): Promise<boolean> => {
    try {
      const userData: any = await apiPost(api.users.login.path, { mobile_number: mobile, password });
      const userObj = {
        id: userData.id || userData.user_id,
        fullName: userData.fullName || userData.full_name,
        mobile: userData.mobile || userData.mobile_number,
        email: userData.email,
        city: userData.city || null,
        country: userData.country || null,
        profilePicture: userData.profilePicture || null,
        createdAt: new Date(userData.createdAt || userData.created_at),
      };
      setUser(userObj);
      localStorage.setItem("fintrack_user", JSON.stringify(userObj));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("fintrack_user");
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("fintrack_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}