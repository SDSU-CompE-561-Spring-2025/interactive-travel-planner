"use client"

import { createContext, useState, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: any;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

interface AuthResponse {
    access_token: string;
}

const defaultContext: AuthContextType = {
    user: null,
    login: async () => {},
    logout: () => {}
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    const login = async (username: string, password: string) => {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            const response = await axios.post<AuthResponse>('http://localhost:8000/auth/token', formData, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            });
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            localStorage.setItem('token', response.data.access_token);
            setUser(response.data);
            router.push('/');
        } catch (error: any) {
            console.error('Login Failed:', {
                message: error?.message,
                status: error?.response?.status,
                data: error?.response?.data
            });
        }
    };

    const logout = () => {
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        router.push('/login')
    };

    return (
        <AuthContext.Provider value={{ user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
