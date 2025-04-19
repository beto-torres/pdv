import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Item {
    id: number;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export const Vendas: React.FC = () => {

    const { logout } = useAuth();
    const navigate = useNavigate();


    const [items, setItems] = useState<Item[]>([
        { id: 1, name: 'Arroz Tipo 1 (5kg)', quantity: 1, unitPrice: 25.9, subtotal: 25.9 },
        { id: 2, name: 'Feijão Preto (1kg)', quantity: 2, unitPrice: 12.5, subtotal: 25.0 },
        { id: 3, name: 'Macarrão Espaguete (500g)', quantity: 3, unitPrice: 4.5, subtotal: 13.5 },
        { id: 4, name: 'Óleo de Soja (900ml)', quantity: 1, unitPrice: 8.9, subtotal: 8.9 },
        { id: 5, name: 'Sabão em Pó (1kg)', quantity: 2, unitPrice: 15.0, subtotal: 30.0 },
        { id: 6, name: 'Papel Higiênico (4 rolos)', quantity: 1, unitPrice: 12.0, subtotal: 12.0 },
    ]);

    const [isPixModalOpen, setIsPixModalOpen] = useState(false);
    const totalValue = items.reduce((sum, item) => sum + item.subtotal, 0);

    const handlePrintReceipt = () => {
        alert('Cupom impresso!');
    };

    const openPixModal = () => {
        setIsPixModalOpen(true);
    };

    const closePixModal = () => {
        setIsPixModalOpen(false);
    };

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

    return (
        <div className="bg-gray-100 h-screen flex flex-col">
            {/* Header */}
            <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Mercadinho do Beto</h1>
                <div className="flex gap-2">
                    <button className="bg-green-600 px-3 py-1 rounded-md hover:bg-green-500" onClick={openPixModal}>
                        Finalizar Venda
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault(); // Impede o comportamento padrão do link
                            handleLogout(); // Chama a função de logout
                        }} className="bg-orange-600 px-3 py-1 rounded-md hover:bg-orange-500">Logout</button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar Esquerda */}
                <aside className="w-full md:w-1/3 bg-white border-r border-gray-300 p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="barcode" className="font-semibold">
                            Código de Barras:
                        </label>
                        <input
                            type="text"
                            id="barcode"
                            placeholder="Digite o código ou escaneie"
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Funções Rápidas:</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="bg-blue-500 text-white px-3 py-4 rounded-md hover:bg-blue-600">
                                Desconto
                            </button>
                            <button className="bg-red-500 text-white px-3 py-4 rounded-md hover:bg-red-600">
                                Cancelar Item
                            </button>
                            <button className="bg-yellow-500 text-black px-3 py-4 rounded-md hover:bg-yellow-600">
                                Pesquisar Produto
                            </button>
                            <button className="bg-green-500 text-white px-3 py-4 rounded-md hover:bg-green-600">
                                Adicionar Manualmente
                            </button>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <p className="text-sm text-gray-500">Versão 1.0.0</p>
                    </div>
                </aside>

                {/* Painel Direito */}
                <section className="flex-1 bg-white p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Lista de Compras</h2>
                        <p className="text-lg text-gray-700 font-bold">
                            Total: <span className="text-2xl text-green-600">R$ {totalValue.toFixed(2)}</span>
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto border border-gray-300 rounded-md p-4 bg-gray-50">
                        <table className="w-full text-left table-fixed">
                            <thead>
                                <tr className="border-b border-gray-300">
                                    <th className="w-1/12 pb-2 font-semibold text-center">#</th>
                                    <th className="w-5/12 pb-2 font-semibold">Produto</th>
                                    <th className="w-2/12 pb-2 font-semibold text-center">Quantidade</th>
                                    <th className="w-2/12 pb-2 font-semibold text-right">Preço Unitário</th>
                                    <th className="w-2/12 pb-2 font-semibold text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-300">
                                        <td className="py-1 text-center">{item.id}</td>
                                        <td className="py-1">{item.name}</td>
                                        <td className="py-1 text-center">{item.quantity}</td>
                                        <td className="py-1 text-right">R$ {item.unitPrice.toFixed(2)}</td>
                                        <td className="py-1 text-right">R$ {item.subtotal.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <button className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600" onClick={handlePrintReceipt}>
                            Imprimir Cupom
                        </button>
                        <p className="text-sm text-gray-500">
                            Itens: <span className="font-bold">{items.length}</span>
                        </p>
                    </div>
                </section>
            </main>

            {/* Modal de Pagamento por PIX */}
            {isPixModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Pagamento via PIX</h3>
                        <div className="flex flex-col items-center">
                            <img
                                src="https://b2024479.smushcdn.com/2024479/wp-content/uploads/2020/05/HelloTech-qr-code-1024x1024.jpg?lossy=1&strip=1&webp=1"
                                alt="QR Code"
                                className="mb-4"
                            />
                            <p className="text-sm text-gray-600 mb-4">
                                Valor: <span className="font-bold text-green-600">R$ {totalValue.toFixed(2)}</span>
                            </p>
                            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={closePixModal}>
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-gray-200 p-2 text-center text-xs text-gray-500">
                Desenvolvido por Mercadinho do Beto | Todos os direitos reservados
            </footer>
        </div>
    );
};