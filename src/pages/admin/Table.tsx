// Table.tsx
import React, { JSX } from "react";
import { useTheme } from "../../context/ThemeContext";

interface Transaction {
    date: string;
    operation: string;
    value: string;
    cashRegister: string;
    user: string;
}

interface TableProps {
    transactions: Transaction[];
}

const Table: React.FC<TableProps> = ({ transactions }) => {
    const { theme } = useTheme();

    // Função para formatar valores monetários
    const formatCurrency = (value: string): string => {
        const numericValue = parseFloat(value.replace('R$', '').replace(',', '.').trim());
        return numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // Função para determinar o ícone da operação
    const getOperationIcon = (operation: string): JSX.Element => {
        switch (operation.toLowerCase()) {
            case 'abertura':
                return <span className="text-green-500">✅</span>;
            case 'venda':
                return <span className="text-blue-500">🛒</span>;
            default:
                return <span>----</span>;
        }
    };

    return (
        <div className="overflow-x-auto ">
            <table
                className={`w-full border-collapse max-h-[60vh] overflow-y-auto ${theme === 'light'
                    ? 'bg-white text-black border-gray-300'
                    : 'bg-gray-800 text-white border-gray-700'
                    }`}
            >
                {/* Cabeçalho */}
                <thead>
                    <tr>
                        <th
                            className={`p-2 border-b-2 ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                } font-semibold text-left`}
                            scope="col"
                        >
                            Data
                        </th>
                        <th
                            className={`p-2 border-b-2 ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                } font-semibold text-left`}
                            scope="col"
                        >
                            Operação
                        </th>
                        <th
                            className={`p-2 border-b-2 ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                } font-semibold text-right`}
                            scope="col"
                        >
                            Valor
                        </th>
                        <th
                            className={`p-2 border-b-2 ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                } font-semibold text-left`}
                            scope="col"
                        >
                            Caixa
                        </th>
                        <th
                            className={`p-2 border-b-2 ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                } font-semibold text-left`}
                            scope="col"
                        >
                            Usuário
                        </th>
                    </tr>
                </thead>

                {/* Corpo da Tabela */}
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr
                            key={index}
                            className={`${index % 2 === 0
                                ? theme === 'light'
                                    ? 'bg-gray-100'
                                    : 'bg-gray-700'
                                : theme === 'light'
                                    ? 'bg-white'
                                    : 'bg-gray-800'
                                }`}
                        >
                            <td className="p-2 border-b">{transaction.date}</td>
                            <td className="p-2 border-b flex items-center gap-2">
                                {getOperationIcon(transaction.operation)} {transaction.operation}
                            </td>
                            <td className="p-2 border-b text-right">{formatCurrency(transaction.value)}</td>
                            <td className="p-2 border-b">{transaction.cashRegister}</td>
                            <td className="p-2 border-b">{transaction.user}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;