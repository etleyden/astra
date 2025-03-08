// src/components/ProtectedRoute.tsx
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const [isClient, setIsClient] = useState(false); //check if we're rendering on the client side to prevent premature redirects
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);
    useEffect(() => {
        if (isClient && !loading && !user) {
            console.log("user not found. redirecting. ");
            router.push("/");
        }
    }, [isClient, loading, user, router]);

    if (!isClient || loading) {
        // Redirect user if not authenticated
        return <p>Loading...</p>; // Or show some loading state
    }

    return <>{children}</>; // Render children only if authenticated
}
