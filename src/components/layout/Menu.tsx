import { NavLink, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";

import "./Layout.css";

export default function Menu({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    const getInitials = () => {
        if (!user?.name) {
            return "U";
        }

        return user.name
            .split(" ")
            .map((name: string) => name[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <div className="content">
            <aside className="menu-lateral">
                <div className="menu-topo">
                    <div className="home">
                        <div className="menu-logo">
                            <svg
                                className="svg search"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                            >
                                <g fill="#616161">
                                    <path d="m29.175 31.99l2.828-2.827l12.019 12.019l-2.828 2.827z" />
                                    <circle cx="20" cy="20" r="16" />
                                </g>
                                <path fill="#37474f" d="m32.45 35.34l2.827-2.828l8.696 8.696l-2.828 2.828z" />
                                <circle cx="20" cy="20" r="13" fill="#64b5f6" />
                                <path fill="#bbdefb" d="M26.9 14.2c-1.7-2-4.2-3.2-6.9-3.2s-5.2 1.2-6.9 3.2c-.4.4-.3 1.1.1 1.4c.4.4 1.1.3 1.4-.1C16 13.9 17.9 13 20 13s4 .9 5.4 2.5c.2.2.5.4.8.4c.2 0 .5-.1.6-.2c.4-.4.4-1.1.1-1.5" />
                            </svg>
                        </div>

                        <div>
                            <h1 className="titulo">Sistema</h1>
                            <span className="menu-subtitulo">
                                Inteligência de editais
                            </span>
                        </div>
                    </div>

                    <nav className="options">
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? "rota active" : "rota"
                            }
                            to="/dashboard"
                        >
                            <span className="rota-icon">📊</span>
                            Dashboard
                        </NavLink>

                        <NavLink
                            className={({ isActive }) =>
                                isActive ? "rota active" : "rota"
                            }
                            to="/oportunidades"
                        >
                            <span className="rota-icon">🔍</span>
                            Oportunidades
                        </NavLink>

                        <NavLink
                            className={({ isActive }) =>
                                isActive ? "rota active" : "rota"
                            }
                            to="/perfil"
                        >
                            <span className="rota-icon">🏢</span>
                            Perfil da Empresa
                        </NavLink>
                    </nav>
                </div>

                <div className="usuario-logout">
                    <div className="menu-user">
                        <div className="logo-iniciais">
                            <span className="iniciais">
                                {getInitials()}
                            </span>
                        </div>

                        <div className="nome-email">
                            <span className="nome">
                                {user?.name || "Usuário"}
                            </span>

                            <span className="email">
                                {user?.email || "usuario@email.com"}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="logout"
                        onClick={handleLogout}
                        title="Sair"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="23"
                            height="23"
                            viewBox="0 0 24 24"
                        >
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path
                                fill="currentColor"
                                d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4t-.288.713T11 5H5v14h6q.425 0 .713.288T12 20t-.288.713T11 21zm12.175-8H10q-.425 0-.712-.288T9 12t.288-.712T10 11h7.175L15.3 9.125q-.275-.275-.275-.675t.275-.7t.7-.313t.725.288L20.3 11.3q.3.3.3.7t-.3.7l-3.575 3.575q-.3.3-.712.288t-.713-.313q-.275-.3-.262-.712t.287-.688z"
                            />
                        </svg>
                    </button>
                </div>
            </aside>

            <main className="pagina">
                {children}
            </main>
        </div>
    );
}