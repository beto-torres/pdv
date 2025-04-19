// src/pages/Unauthorized.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const Unauthorized: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
            {/* Título */}
            <h1 className="text-4xl font-bold text-red-600 mb-4">Acesso Negado</h1>

            {/* Mensagem */}
            <p className="text-lg text-gray-700 mb-8">
                Você não tem permissão para acessar esta página.
            </p>

            {/* Ações */}
            <div className="flex gap-4">
                {/* Botão para voltar à página inicial */}
                <Link
                    to="/"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Voltar para a Página Inicial
                </Link>

                {/* Botão para fazer login novamente */}
                <Link
                    to="/login"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                    Fazer Login
                </Link>
            </div>
        </div>
    );
};