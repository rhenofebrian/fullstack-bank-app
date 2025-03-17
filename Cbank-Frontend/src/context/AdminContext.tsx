import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { adminService } from "../services/adminApi";

interface Admin {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface AdminContextType {
  admin: Admin | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const storedAdmin = localStorage.getItem("adminInfo");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const response = await adminService.login(credentials);
    setAdmin(response.admin);
    return response;
  };

  const logout = () => {
    adminService.logout();
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
