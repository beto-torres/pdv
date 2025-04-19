import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import video from '../videos/background.mp4';

export const LoginPage: React.FC = () => {
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    // Constantes para rotas
    const ROUTES = {
        HOME: '/home',
        VENDAS: '/vendas',
    };

    // Verifica se o usuário já está logado ao carregar a página
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            try {
                // Decodifica o token para verificar o perfil do usuário
                const payload = authToken.split('.')[1];
                if (!payload) throw new Error('Token inválido.');

                const decodedToken = JSON.parse(atob(payload));
                const profile = decodedToken.role; // Supondo que o campo "role" esteja no token

                // Redireciona com base no perfil
                if (profile === 'admin') {
                    navigate(ROUTES.HOME);
                } else if (profile === 'vendedor') {
                    navigate(`${ROUTES.VENDAS}/${decodedToken.id}`);
                } else {
                    throw new Error('Perfil inválido.');
                }
            } catch (error) {
                console.error('Erro ao validar o token:', error);
                Swal.fire({
                    title: 'Sessão inválida',
                    text: 'Sua sessão expirou ou é inválida. Faça login novamente.',
                    icon: 'error',
                    confirmButtonColor: "#FF0000",
                    confirmButtonText: 'OK',
                });
                localStorage.removeItem('authToken'); // Remove o token inválido
            }
        }
    }, [navigate]);

    // Função para realizar o login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validação mínima da senha
        if (senha.length < 6) {
            Swal.fire({
                title: 'Senha inválida',
                text: 'A senha deve ter pelo menos 6 caracteres.',
                icon: 'warning',
                confirmButtonColor: "#FF0000",
                confirmButtonText: 'OK',
            });
            return;
        }

        const apiUrl = 'http://localhost:3001/api-pdv/funcionarios/login-funcionario/';

        try {
            // Envia os dados de login para o backend
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf, senha }),
            });

            if (!response.ok) {
                throw new Error('CPF ou senha incorretos.');
            }

            const data = await response.json();
            const { token, funcionario } = data;

            // Validação do token
            if (!token || !token.includes('.')) {
                throw new Error('Token inválido recebido do backend.');
            }

            // Validação dos dados do funcionário
            if (!funcionario || !funcionario.role) {
                throw new Error('Dados do funcionário não encontrados na resposta.');
            }

            // Salva os dados no localStorage
            localStorage.setItem('authToken', token);

            // Exibe mensagem de sucesso antes do redirecionamento
            Swal.fire({
                title: 'PDV \n Bem Vindo!',
                text: 'Aguarde...',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            }).then(() => {
                // Redireciona com base no role do funcionário
                if (funcionario.role === 'vendedor') {
                    navigate(ROUTES.VENDAS);
                } else if (funcionario.role === 'admin') {
                    navigate(ROUTES.HOME);
                } else {
                    throw new Error('Role inválido recebido do backend.');
                }
            });
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            Swal.fire({
                title: 'Erro ao fazer login',
                text: 'Ocorreu um erro ao tentar acessar o servidor.',
                icon: 'error',
                confirmButtonColor: "#FF0000",
                confirmButtonText: 'OK',
            });
        }
    };

    // Função para aplicar máscara de CPF
    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        if (value.length > 9) {
            value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9, 11)}`;
        } else if (value.length > 6) {
            value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}`;
        } else if (value.length > 3) {
            value = `${value.slice(0, 3)}.${value.slice(3, 6)}`;
        }

        setCpf(value);
    };

    return (
        <div className="relative flex flex-col items-start justify-start pl-24 pt-18 min-h-screen overflow-hidden">
            {/* Vídeo de fundo */}
            <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover opacity-100">
                <source src={video} type="video/mp4" />
                Seu navegador não suporta vídeos.
            </video>
            {/* Overlay escuro */}
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
            {/* Título */}
            <h1 className="text-4xl font-bold text-white mb-2 pl-6 z-10">PDV MERCADINHO</h1>
            {/* Formulário de login */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-sm max-w-sm sm:max-w-lg md:max-w-xl bg-white p-8 rounded-sm shadow-md z-10">
                {/* Campo de CPF */}
                <div>
                    <label htmlFor="cpf" className="block text-gray-700 font-semibold mb-2">CPF</label>
                    <input
                        type="text"
                        id="cpf"
                        placeholder="Digite seu CPF"
                        value={cpf}
                        onChange={handleCpfChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-green-800"
                        required
                    />
                </div>
                {/* Campo de Senha */}
                <div>
                    <label htmlFor="senha" className="block text-gray-700 font-semibold mb-2">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-green-800"
                        required
                    />
                </div>
                {/* Botão de Login */}
                <button
                    type="submit"
                    className="w-full py-3 px-6 bg-amber-500 text-white font-semibold rounded-sm hover:bg-amber-700 transition-colors"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
};