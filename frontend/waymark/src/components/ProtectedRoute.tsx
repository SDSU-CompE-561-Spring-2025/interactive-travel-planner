"use client"

import { useContext, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "../app/context/AuthContext";

interface AuthContextType {
    user: any;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user } = useContext(AuthContext) as AuthContextType;
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    return user ? children : null;
};

export default ProtectedRoute;
