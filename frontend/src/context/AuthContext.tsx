"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
    userId: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    getToken: () => string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            console.info(token);
            try {
                const decodedUser = JSON.parse(atob(token.split(".")[1])); // Decode JWT
                const currentTime = Math.floor(Date.now() / 1000);
                if(decodedUser.exp < currentTime) {
                    console.error("Token expired");
                    throw new Error("Token Expired");
                }
                setUser(decodedUser);
                console.info("Found user");
            } catch {
                localStorage.removeItem("token");
                console.info("No User Found");
            }
        }
        setLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        const decodedUser = JSON.parse(atob(token.split(".")[1]));
        setUser(decodedUser);
        router.push("/dashboard");
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        router.push("/");
    };

    const getToken = () => {
        return localStorage.getItem("token");
    }

    return (
        <AuthContext.Provider value={{ user, loading, getToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
