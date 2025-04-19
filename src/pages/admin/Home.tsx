// Home.tsx
import React from "react";
import Sidebar from "./Sidebar";
import Card from "./Card";
import Header from "./Header";
import Table from "./Table";
import './style.css';
import { useTheme } from '../../context/ThemeContext';

interface Transaction {
    date: string;
    operation: string;
    value: string;
    cashRegister: string;
    user: string;
}

export const Home: React.FC = () => {

    const { theme } = useTheme();

    const transactions: Transaction[] = [
        {
            date: "15/04/2025 07:03:35",
            operation: "Abertura",
            value: "R$ 0,00",
            cashRegister: "Caixa 01",
            user: "Fernandinha",
        },
        {
            date: "15/04/2025 07:10:56",
            operation: "Venda",
            value: "R$ 120,00",
            cashRegister: "Caixa 01",
            user: "Fernandinha",
        },
        {
            date: "15/04/2025 07:05:12",
            operation: "Abertura",
            value: "R$ 0,00",
            cashRegister: "Caixa 02",
            user: "Milena",
        },
        {
            date: "15/04/2025 07:06:25",
            operation: "Abertura",
            value: "R$ 0,00",
            cashRegister: "Caixa 03",
            user: "Júlia",
        },
    ];

    return (
        <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-pdv">
                {/* Header */}
                <Header />

                {/* Content Area */}
                <main className="p-6 overflow-y-auto flex-1">
                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                        <Card title="Total de Vendas" value="R$ 5.820,00" />
                        <Card title="Produtos Ativos" value="128" />
                        <Card title="Usuários Online" value="3" />
                        <Card title="Lucro / Abril" value="R$ 3.850,15" isProfit />
                    </div>

                    {/* Tabela */}
                    <div className="mt-8 bg-pdv rounded-s-sm border border-gray-500 shadow p-4">
                        <h3 className="text-lg font-semibold mb-4">Últimas movimentações</h3>
                        <Table transactions={transactions} />
                    </div>
                </main>
            </div>
        </div>
    );
};