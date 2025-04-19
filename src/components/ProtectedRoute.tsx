// ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type UserProfile = 'aluno' | 'secretario' | 'professor';

interface ProtectedRouteProps {
    allowedProfiles?: UserProfile[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedProfiles }) => {
    const { isAuthenticated, profile } = useAuth();

    // Redireciona para /login se o usuário não estiver autenticado
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Verifica se o perfil do usuário é permitido
    if (allowedProfiles && (!profile || !allowedProfiles.includes(profile))) {
        return <Navigate to="/naoautorizado" replace />;
    }

    // Renderiza o conteúdo da rota protegida
    return <Outlet />;
};