// ThemeContext.tsx
import React, { createContext, useState, useEffect } from 'react';

interface ThemeContextType {
    theme: string;
    toggleTheme: (selectedTheme: "light" | "dark") => void; // Aceita um argumento
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => { },
});

// Hook personalizado para acessar o contexto de tema
export const useTheme = () => {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    }
    return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<string>('light');

    // Carrega o tema salvo no localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
    }, []);

    // Atualiza o tema e salva no localStorage
    const toggleTheme = (selectedTheme: "light" | "dark") => {
        setTheme(selectedTheme);
        localStorage.setItem('theme', selectedTheme);
        document.body.className = selectedTheme; // Aplica a classe no body
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className={theme}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};