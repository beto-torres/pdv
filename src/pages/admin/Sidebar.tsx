// Sidebar.tsx
import React, { JSX } from "react";
import { NavLink } from "react-router-dom"; // Usado para navegação dinâmica
import { useTheme } from "../../context/ThemeContext"; // Usa o contexto de tema

interface MenuItem {
    name: string;
    path: string;
    icon: JSX.Element; // Ícone para o item do menu
}

const Sidebar: React.FC = () => {
    const { theme } = useTheme();

    // Lista de itens do menu com nomes, caminhos e ícones
    const menuItems: MenuItem[] = [
        { name: "Dashboard", path: "/home", icon: <span>📊</span> },
        { name: "Produtos", path: "/produtos", icon: <span>📦</span> },
        { name: "Fornecedores", path: "/fornecedores", icon: <span>🚚</span> },
        { name: "Vendas", path: "/vendas", icon: <span>🛒</span> },
        { name: "Caixa", path: "/caixa", icon: <span>💸</span> },
        { name: "Usuários", path: "/usuarios", icon: <span>👥</span> },
        { name: "Configurações", path: "/configuracoes", icon: <span>⚙️</span> },
    ];

    return (
        <aside
            className={`w-64 flex flex-col border-r border-gray-500 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-pdv text-black"
                }`}
        >
            {/* Cabeçalho */}
            <div
                className={`p-6 text-2xl font-bold border-b border-gray-500 flex items-center justify-center ${theme === "dark" ? "text-white" : "text-[#0c2d55]"
                    }`}
            >
                PDV Dashboard
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path} // Define a rota dinâmica
                        className={({ isActive }) =>
                            `block py-2 px-4 rounded flex items-center gap-2 transition ${isActive
                                ? "bg-white text-[#0c2d55]"
                                : theme === "dark"
                                    ? "hover:bg-gray-700 hover:text-white"
                                    : "hover:bg-white hover:text-[#0c2d55]"
                            }`
                        }
                    >
                        {item.icon} {/* Ícone */}
                        <span>{item.name}</span> {/* Nome do item */}
                    </NavLink>
                ))}
            </nav>

            {/* Rodapé */}
            <div
                className={`p-4 border-t border-gray-500 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
            >
                Versão 1.0.0
            </div>
        </aside>
    );
};

export default Sidebar;