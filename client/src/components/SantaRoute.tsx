import { Navigate } from "react-router-dom";

interface SantaRouteProps {
    children: React.ReactNode;
}

const SantaRoute = ({ children }: SantaRouteProps) => {
    const token = localStorage.getItem("santa_token");

    if (!token) {
        return <Navigate to="/santa/login" replace />;
    }

    return <>{children}</>;
};

export default SantaRoute;
