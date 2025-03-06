"use client";
import ProtectedRoute from "@/component/ProtectedRoute";
import {useAuth} from "@/context/AuthContext";

export default function Dashboard() {
    const {user, logout} = useAuth();

    return (
        <ProtectedRoute>
            <div className="p-5">
                <h1 className="text-3xl font-bold">Welcome, {user?.first_name}!</h1>
                <button className="btn btn-primary" onClick={logout}>Logout</button>
            </div>
        </ProtectedRoute>
    );
}