import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Contexto de autenticação
import { Unauthorized } from './pages/Unauthorized'; // Página de acesso não autorizado
import { LoginPage } from './pages/LoginPage'; // Página de login
import { Vendas } from './pages/Vendas'; // Página inicial
import { Home } from './pages/admin/Home';
import { ThemeProvider } from './context/ThemeContext';
import { Fornecedor } from './pages/admin/manutencao/Fornecedor';

function App() {
  return (
    <ThemeProvider> {/* Envolva tudo com ThemeProvider */}
      <AuthProvider> {/* Mantenha o AuthProvider para autenticação */}
        <Router>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/naoautorizado" element={<Unauthorized />} />

            {/* Rotas Privadas */}
            <Route path="/vendas" element={<Vendas />} />
            <Route path="/home" element={<Home />} />
            <Route path="/fornecedores" element={<Fornecedor />} />

            {/* Rota de Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;