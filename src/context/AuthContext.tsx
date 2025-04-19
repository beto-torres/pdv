// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface DecodedToken {
    profile: 'vendedor' | 'admin'; // Tipos de perfil atualizados
    userId?: string; // Substitui idAluno por userId
    exp?: number; // Tempo de expiração do token
}

interface AuthContextType {
    token: string | null;
    profile: 'vendedor' | 'admin' | null; // Tipos de perfil atualizados
    userId: string | null; // Substitui idAluno por userId
    login: (newToken: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    profile: null,
    userId: null, // Substitui idAluno por userId
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [profile, setProfile] = useState<'vendedor' | 'admin' | null>(null); // Tipos de perfil atualizados
    const [userId, setUserId] = useState<string | null>(null); // Substitui idAluno por userId

    const isValidToken = (token: string): boolean => {
        try {
            const payload = token.split('.')[1];
            if (!payload) return false;

            const decodedToken = JSON.parse(atob(payload)) as DecodedToken;

            // Verifica se os campos obrigatórios estão presentes
            if (!decodedToken.profile || typeof decodedToken.profile !== 'string') {
                return false;
            }

            // Verifica se o token não expirou
            const currentTime = Math.floor(Date.now() / 1000);
            if (decodedToken.exp && decodedToken.exp < currentTime) {
                return false;
            }

            return true;
        } catch (error) {
            console.error('Erro ao validar o token:', error);
            return false;
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken && isValidToken(storedToken)) {
            setToken(storedToken);

            const payload = storedToken.split('.')[1];
            const decodedToken = JSON.parse(atob(payload)) as DecodedToken;
            setProfile(decodedToken.profile);
            setUserId(decodedToken.userId || null); // Usa userId em vez de idAluno
        } else {
            logout();
        }
    }, []);

    const login = (newToken: string) => {
        if (!isValidToken(newToken)) {
            console.error('Token inválido.');
            return;
        }

        setToken(newToken);
        localStorage.setItem('token', newToken);

        const payload = newToken.split('.')[1];
        const decodedToken = JSON.parse(atob(payload)) as DecodedToken;
        setProfile(decodedToken.profile);
        setUserId(decodedToken.userId || null); // Usa userId em vez de idAluno
    };

    const logout = () => {
        setToken(null);
        setProfile(null);
        setUserId(null); // Limpa userId em vez de idAluno
        localStorage.removeItem('token');
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, profile, userId, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};