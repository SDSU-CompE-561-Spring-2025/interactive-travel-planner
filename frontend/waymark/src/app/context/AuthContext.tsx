"use client"

import { createContext, useState, ReactNode } from "react";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface AuthContextType {
    user: any;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

interface AuthResponse {
    access_token: string;
}

const defaultContext: AuthContextType = {
    user: null,
    login: async () => {},
    logout: () => {},
    isAuthenticated: false
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    const login = async (username: string, password: string) => {
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);
            const response = await axiosInstance.post<AuthResponse>('/auth/token', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            });
            const token = response.data.access_token;
            localStorage.setItem('token', token);
            setUser({ username, token });
            toast.success('Successfully logged in!');
        } catch (error: any) {
            console.error('Login Failed:', {
                message: error?.message,
                status: error?.response?.status,
                data: error?.response?.data
            });
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        router.push('/login');
        toast.success('Successfully logged out!');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
