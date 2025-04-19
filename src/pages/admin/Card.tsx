// Card.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

interface CardProps {
    title: string;
    value: string;
    isProfit?: boolean; // Indica se o valor é um lucro
}

const Card: React.FC<CardProps> = ({ title, value, isProfit = false }) => {
    const { theme } = useTheme();

    return (
        <div
            className={`p-4 rounded-sm shadow ${theme === "light"
                    ? "bg-white text-black border border-gray-300"
                    : "bg-gray-800 text-white border border-gray-700"
                }`}
        >
            {/* Título */}
            <h2 className="font-semibold text-sm mb-2">{title}</h2>

            {/* Valor */}
            <p
                className={`text-xl font-bold ${isProfit
                        ? "text-green-500" // Verde para lucro
                        : "text-red-500" // Vermelho para perda
                    }`}
            >
                {value}
            </p>
        </div>
    );
};

export default Card;