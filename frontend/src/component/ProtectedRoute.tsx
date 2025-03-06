// src/components/ProtectedRoute.tsx
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if(!user) {
            router.push("/");
        }
    }, [user, router]);

    if (!user) {
        // Redirect user if not authenticated
        return <p>Loading...</p>; // Or show some loading state
    }

    return <>{children}</>; // Render children only if authenticated
}
