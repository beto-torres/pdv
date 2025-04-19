/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
//import { Menu } from './Menu';

// Interface para definir as props do componente
interface PdvProps {
    children: React.ReactNode; // Conteúdo filho
}

// Componente principal que define o layout da página
export const Pdv: React.FC<PdvProps> = ({ children }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    // Estado para controlar se o menu lateral está aberto ou fechado
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Estado para armazenar os dados do usuário logado
    const [userData, setUserData] = useState<any | null>(null);

    // Referências para o menu lateral e o botão de alternância
    const sidebarRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Fecha o menu ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Carrega os dados do usuário do localStorage ao montar o componente
    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        const storedProfile = localStorage.getItem('profile'); // Recupera o perfil diretamente

        if (storedUserData) {
            try {
                const parsedUserData = JSON.parse(storedUserData);
                console.log('Dados do usuário carregados:', parsedUserData); // Log para depuração
                setUserData(parsedUserData); // Define os dados do usuário no estado
            } catch (error) {
                console.error('Erro ao analisar os dados do usuário:', error);
            }
        }

        // Verifica o perfil diretamente no localStorage
        if (storedProfile) {
            console.log('Perfil recuperado do localStorage:', storedProfile);
        }
    }, []);

    const handleLogout = () => {
        // Remove o token e os dados do usuário do localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('profile');

        // Chama o método de logout do contexto (se necessário)
        logout();

        // Redireciona para a página de login
        navigate('/login');
    };

    // Resgata o perfil diretamente do localStorage
    const profileFromStorage = localStorage.getItem('profile')?.toLowerCase();
    // const isAluno = profileFromStorage === 'aluno'; // Verifica se o perfil é "aluno"

    console.log('PERFIL DO USUÁRIO:', profileFromStorage);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-md flex items-center justify-between px-4 py-3 md:hidden">
                {/* Botão para abrir/fechar o menu lateral */}
                <button
                    ref={buttonRef}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                        />
                    </svg>
                </button>

                {/* Nome da aplicação */}
                <h1 className="text-lg font-bold text-gray-800">Escola Digital</h1>
            </header>

            {/* Layout principal com menu lateral e conteúdo */}
            <div className="flex flex-1">
                {/* Menu Lateral */}
                <aside
                    ref={sidebarRef}
                    className={`bg-gray-800 text-white w-64 space-y-6 py-4 px-2 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        } md:translate-x-0 md:relative fixed inset-y-0 left-0 z-50 md:w-64`}
                >
                    {/* Logo e nome da aplicação */}
                    <div className="flex items-center justify-center mb-6">
                        <img
                            src="https://cdn-icons-png.flaticon.com/128/3663/3663664.png" // Substitua pelo caminho do seu logo
                            alt="Logo"
                            className="w-10 h-10 rounded-full mr-2"
                        />
                        <h2 className="text-xl font-bold hidden md:block">Escola Digital</h2>
                    </div>

                    {/* Informações do Usuário Logado */}
                    {userData && (
                        <div className="px-4 py-1 bg-gray-700 text-white rounded-xs mb-4">
                            <p className="text-sm">Usuário: <span className="text-sm text-green-500">{userData.cpf || userData.funcionario?.cpf}</span></p>
                            <div className="flex justify-between gap-2 items-center">
                                <p className="text-sm text-gray-300">
                                    Perfil: <span className="text-sm text-green-500">{userData.tipo?.descricao || 'Aluno'}</span>
                                </p>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault(); // Impede o comportamento padrão do link
                                        handleLogout(); // Chama a função de logout
                                    }}
                                    className="flex items-center gap-1 px-4 text-sm text-white hover:text-red-500 transition-colors"
                                >
                                    {/* Ícone SVG */}
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    {/* Texto "Sair" */}
                                    Sair
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Renderiza o Menu apenas se o usuário não for aluno */}
                    {/* {!isAluno && (
                        <Menu />
                    )} */}
                </aside>

                {/* Conteúdo principal */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};