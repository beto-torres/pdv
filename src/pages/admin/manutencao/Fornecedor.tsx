import React, { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import MainContent from "../MainContent";
import Card from "../Card";
import axios from "axios"; // Importando Axios
import { z } from "zod"; // Importando Zod
import { ToastContainer, toast } from "react-toastify"; // Importando react-toastify
import "react-toastify/dist/ReactToastify.css"; // Importando estilos do react-toastify

// Função para aplicar a máscara ao CNPJ
const formatCNPJ = (value: string): string => {
    const numericValue = value.replace(/\D/g, ""); // Remove caracteres não numéricos
    return numericValue
        .replace(/^(\d{2})(\d)/, "$1.$2") // Adiciona ponto após os primeiros 2 dígitos
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3") // Adiciona ponto após os próximos 3 dígitos
        .replace(/\.(\d{3})(\d)/, ".$1/$2") // Adiciona barra após os próximos 3 dígitos
        .replace(/(\d{4})(\d)/, "$1-$2"); // Adiciona traço após os próximos 4 dígitos
};

// Definindo o esquema de validação com Zod
const supplierSchema = z.object({
    cnpj: z.string({ required_error: "O CNPJ é obrigatório." })
        .min(14, "O CNPJ deve conter 14 dígitos numéricos.")
        .max(14, "O CNPJ deve conter 14 dígitos numéricos."),
    nome: z.string({ required_error: "O nome é obrigatório." }).min(1, "O nome é obrigatório."),
    situacao: z.boolean({ invalid_type_error: "A situação deve ser um valor booleano." }),
});

interface Supplier {
    id: number;
    cnpj: string;
    nome: string;
    situacao: boolean;
}

export const Fornecedor: React.FC = () => {
    const { theme } = useTheme();

    // Estado para armazenar a lista de fornecedores
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [formData, setFormData] = useState<Supplier>({
        id: 0,
        cnpj: "",
        nome: "",
        situacao: true,
    });

    // Estado para controle do modal de edição/adicionar
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Estado para mensagens de erro
    const [errors, setErrors] = useState<{ cnpj?: string; nome?: string }>({});

    // Função para carregar fornecedores da API
    const fetchSuppliers = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api-pdv/fornecedores/");
            setSuppliers(response.data);
        } catch (error) {
            toast.error("Erro ao carregar fornecedores.", { autoClose: 3000 });
        }
    };

    // Carregar fornecedores ao montar o componente
    React.useEffect(() => {
        fetchSuppliers();
    }, []);

    // Função para abrir o modal de edição
    const openEditModal = (supplier: Supplier) => {
        setFormData({
            ...supplier,
            cnpj: formatCNPJ(supplier.cnpj), // Aplica a máscara ao CNPJ ao abrir o modal
        });
        setEditingId(supplier.id);
        setIsModalOpen(true);
    };

    // Função para abrir o modal de adição
    const openAddModal = () => {
        setFormData({
            id: 0,
            cnpj: "",
            nome: "",
            situacao: true,
        });
        setEditingId(null);
        setIsModalOpen(true);
    };

    // Função para fechar o modal
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({
            id: 0,
            cnpj: "",
            nome: "",
            situacao: true,
        });
        setErrors({});
    };

    // Função para lidar com mudanças nos inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let updatedValue = value;

        // Aplicar máscara ao CNPJ
        if (name === "cnpj") {
            updatedValue = formatCNPJ(value); // Aplica a máscara ao CNPJ
        } else if (name === "situacao") {
            updatedValue = value === "true"; // Converte o valor do select para booleano
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: updatedValue,
        }));

        // Limpar erros de validação ao interagir com o formulário
        if (errors.cnpj || errors.nome) {
            setErrors({});
        }
    };

    // Função para salvar ou atualizar o fornecedor
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Remover máscara antes de validar
            const numericCNPJ = formData.cnpj.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
            const dataToValidate = { ...formData, cnpj: numericCNPJ };

            // Validar os dados usando o esquema do Zod
            const validationResult = supplierSchema.safeParse(dataToValidate);

            if (!validationResult.success) {
                // Extrair mensagens de erro do Zod
                const fieldErrors = validationResult.error.flatten().fieldErrors;
                setErrors({
                    cnpj: fieldErrors.cnpj?.[0],
                    nome: fieldErrors.nome?.[0],
                });
                return;
            }

            if (editingId) {
                // Atualizar fornecedor
                await axios.put(`http://localhost:3001/api-pdv/fornecedores/${editingId}`, {
                    ...dataToValidate,
                    cnpj: numericCNPJ, // Envia o CNPJ sem máscara
                });
                toast.success("Fornecedor atualizado com sucesso!", { autoClose: 3000 });
            } else {
                // Adicionar novo fornecedor
                await axios.post("http://localhost:3001/api-pdv/fornecedores/", {
                    ...dataToValidate,
                    cnpj: numericCNPJ, // Envia o CNPJ sem máscara
                });
                toast.success("Fornecedor adicionado com sucesso!", { autoClose: 3000 });
            }

            // Recarregar lista de fornecedores e fechar o modal
            fetchSuppliers();
            closeModal();
        } catch (error) {
            toast.error("Erro ao salvar fornecedor.", { autoClose: 3000 });
        }
    };

    // Função para excluir um fornecedor
    const handleDelete = async (id: number) => {
        if (!window.confirm("Tem certeza que deseja excluir este fornecedor?")) return;

        try {
            await axios.delete(`http://localhost:3001/api-pdv/fornecedores/${id}`);
            toast.success("Fornecedor excluído com sucesso!", { autoClose: 3000 });
            fetchSuppliers();
        } catch (error) {
            toast.error("Erro ao excluir fornecedor.", { autoClose: 3000 });
        }
    };

    return (
        <MainContent>
            {/* Título */}
            <h2 className="text-2xl font-semibold mb-4">Manutenção de Fornecedores</h2>

            {/* Barra de Pesquisa */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Pesquisar fornecedor..."
                    className={`w-full p-2 border rounded-md ${theme === "light" ? "border-gray-300 bg-white" : "border-gray-600 bg-gray-700"}`}
                />
            </div>

            {/* Tabela de Fornecedores */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="py-2 px-4 text-left">ID</th>
                            <th className="py-2 px-4 text-left">CNPJ</th>
                            <th className="py-2 px-4 text-left">Nome</th>
                            <th className="py-2 px-4 text-left">Situação</th>
                            <th className="py-2 px-4 text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((supplier) => (
                            <tr key={supplier.id} className="border-b dark:border-gray-600">
                                <td className="py-2 px-4">{supplier.id}</td>
                                <td className="py-2 px-4">{formatCNPJ(supplier.cnpj)}</td> {/* Exibe o CNPJ formatado */}
                                <td className="py-2 px-4">{supplier.nome}</td>
                                <td className="py-2 px-4">
                                    {supplier.situacao ? (
                                        <span className="text-green-500">Ativo</span>
                                    ) : (
                                        <span className="text-red-500">Inativo</span>
                                    )}
                                </td>
                                <td className="py-2 px-4 space-x-2">
                                    <button
                                        onClick={() => openEditModal(supplier)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(supplier.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Botão para Adicionar Novo Fornecedor */}
            <button
                onClick={openAddModal}
                className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
                Adicionar Fornecedor
            </button>

            {/* Modal de Edição/Adição */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">
                            {editingId ? "Editar Fornecedor" : "Adicionar Fornecedor"}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            {/* Campo CNPJ */}
                            <div className="mb-4">
                                <label htmlFor="cnpj" className="block text-sm font-medium mb-1">
                                    CNPJ
                                </label>
                                <input
                                    type="text"
                                    id="cnpj"
                                    name="cnpj"
                                    value={formData.cnpj}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded-md ${errors.cnpj ? "border-red-500" : theme === "light" ? "border-gray-300 bg-white" : "border-gray-600 bg-gray-700"
                                        }`}
                                    placeholder="Digite o CNPJ"
                                    maxLength={18} // Limita o comprimento máximo do CNPJ formatado
                                />
                                {errors.cnpj && <p className="text-red-500 text-sm mt-1">{errors.cnpj}</p>}
                            </div>

                            {/* Campo Nome */}
                            <div className="mb-4">
                                <label htmlFor="nome" className="block text-sm font-medium mb-1">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded-md ${errors.nome ? "border-red-500" : theme === "light" ? "border-gray-300 bg-white" : "border-gray-600 bg-gray-700"
                                        }`}
                                    placeholder="Digite o nome do fornecedor"
                                />
                                {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
                            </div>

                            {/* Campo Situação */}
                            <div className="mb-4">
                                <label htmlFor="situacao" className="block text-sm font-medium mb-1">
                                    Situação
                                </label>
                                <select
                                    id="situacao"
                                    name="situacao"
                                    value={formData.situacao.toString()}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded-md ${theme === "light" ? "border-gray-300 bg-white" : "border-gray-600 bg-gray-700"}`}
                                >
                                    <option value="true">Ativo</option>
                                    <option value="false">Inativo</option>
                                </select>
                            </div>

                            {/* Botões */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ToastContainer para exibir notificações */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme === "light" ? "light" : "dark"}
            />
        </MainContent>
    );
};