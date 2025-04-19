// MainContent.tsx
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useTheme } from '../../context/ThemeContext';

interface MainContentProps {
    children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {

    const { theme } = useTheme();

    return (
        <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-pdv">
                {/* Header */}
                <Header />
                <main className="p-6 overflow-y-auto flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainContent;