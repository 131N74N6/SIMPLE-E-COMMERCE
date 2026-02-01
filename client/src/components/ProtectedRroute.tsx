import { Navigate } from "react-router-dom";
import useAuth from "../services/useAuth";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
    children: ReactNode;
}

export default function ProtectedRoute(props: ProtectedRouteProps) {
    const { loading, user } = useAuth();

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-[#1a1a1a]">
            <div className="animate-spin rounded w-12 h-12 border-purple-400"></div>
        </div>
    );

    return user ? <>{props.children}</> : <Navigate to={'/sign-in'} replace/>
}