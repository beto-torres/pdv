// Header.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Header: React.FC = () => {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme(); // Usa o hook de tema
    const navigate = useNavigate();

    // Função para lidar com o logout
    const handleLogout = () => {
        // Remove os dados do usuário do localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("profile");

        // Chama o método de logout do contexto (se necessário)
        logout();

        // Redireciona para a página de login
        navigate("/login");
    };

    return (
        <header className="bg-pdv pb-9 p-4 shadow flex items-center justify-between border-b border-gray-500">
            {/* Título */}
            <h1 className="text-xl font-semibold flex items-center">Painel de Controle</h1>

            {/* Seção de controle (tema e logout) */}
            <span className="text-sm flex items-center gap-4">
                {/* Botões para alternar o tema */}
                <button
                    className={`px-2 py-1 rounded ${theme === "light" ? "bg-gray-300 text-black" : "bg-gray-700 text-white"
                        }`}
                    onClick={() => toggleTheme("light")} // Passa "light" como argumento
                >
                    Light
                </button>
                <button
                    className={`px-2 py-1 rounded ${theme === "dark" ? "bg-gray-300 text-black" : "bg-gray-700 text-white"
                        }`}
                    onClick={() => toggleTheme("dark")} // Passa "dark" como argumento
                >
                    Dark
                </button>

                {/* Informações do usuário */}
                Usuário:
                <code className="text-yellow-300"> admin </code>

                {/* Botão de logout */}
                <div className="text-right">
                    <a
                        href="#"
                        className="hover:underline"
                        onClick={(e) => {
                            e.preventDefault(); // Impede o comportamento padrão do link
                            handleLogout(); // Chama a função de logout
                        }}
                    >
                        Sair
                    </a>
                </div>
            </span>
        </header>
    );
};

export default Header;