
import './oportunidade.css';
import { useState, useEffect } from 'react';
import api from '../../services/api';

function Oportunidades() {
    const interessesDisponiveis = [
        "Agronegócio",
        "Tecnologia",
        "Saúde",
        "Infraestrutura",
        "Educação",
        "Inovação",
        "Sustentabilidade",
        "Turismo",
        "Energia",
        "Logística",
        "Indústria",
        "Construção Civil",
        "Inteligência Artificial",
        "Segurança",
        "Pesquisa",
    ];
    
    const [buscaInteresse, setBuscaInteresse] = useState("");
    const [interessesSelecionados, setInteressesSelecionados] = useState<string[]>([]);

    const interessesFiltrados = interessesDisponiveis.filter(
        interesse =>
            interesse
                .toLowerCase()
                .includes(buscaInteresse.toLowerCase())
    );

    const getUser = () => {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    };

    useEffect(() => {
        carregarInteresses();
    }, []);

    useEffect(() => {
        const user = getUser();
        if (!user) return;

        // if (interessesSelecionados.length === 0) return;

        const timeout = setTimeout(() => {
            salvarInteresses(interessesSelecionados);
        }, 500);

        return () => clearTimeout(timeout);
    }, [interessesSelecionados]);

    const carregarInteresses = async () => {
        try {
            const user = getUser();

            if (!user) {
                console.error("Usuário não encontrado");
                return;
            }

            const response = await api.get(
                `/company/interests?user_id=${user.id}`
            );

            setInteressesSelecionados(response.data.interests);

        } catch (error) {
            console.error(error);
        }
    };

    const salvarInteresses = async (interesses: string[]) => {
        try {
            const user = getUser();

            if (!user) {
                alert("Usuário não autenticado");
                return;
            }

            await api.put("/company/interests", {
                interests: interesses,
                user_id: user.id
            });

        } catch (error) {
            console.error(error);
        }
    };

    const selecionarInteresse = (interesse: string) => {
        if (
            interessesSelecionados.includes(interesse)
        ) {
            return;
        }

        if (
            interessesSelecionados.length >= 3
        ) {
            alert("Você pode selecionar no máximo 3 interesses.");
            return;
        }

        const novosInteresses = [
            ...interessesSelecionados,
            interesse
        ];

        setInteressesSelecionados(
            novosInteresses
        );

        salvarInteresses(
            novosInteresses
        );

        setBuscaInteresse("");
    };
    
    const removerInteresse = (
        interesse: string
    ) => {

        const novosInteresses =
            interessesSelecionados.filter(
                item => item !== interesse
            );

        setInteressesSelecionados(
            novosInteresses
        );

        salvarInteresses(
            novosInteresses
        );
    };

    return(
        <div className="oportunidades">
            <div className="home-buscar">
                <span className='titulo-oportunidade-buscar'>ENCONTRE OPORTUNIDADES</span>
                <input type="text" placeholder="Pesquise um interesse..." value={buscaInteresse} onChange={(e) => setBuscaInteresse(e.target.value)} />
                {
                    buscaInteresse &&
                    (
                        <div className="lista-interesses">

                            {
                                interessesFiltrados.map((interesse) => (
                                    <div
                                        key={interesse}
                                        className="item-interesse"
                                        onClick={() =>
                                            selecionarInteresse(interesse)
                                        }
                                    >
                                        {interesse}
                                    </div>
                                ))
                            }

                        </div>
                    )
                }

                <div className="interesses-selecionados">
                    {
                        interessesSelecionados.map(
                            (interesse) => (
                                <div
                                    key={interesse}
                                    className="interesse-tag"
                                >
                                    <span>
                                        {interesse}
                                    </span>

                                    <button
                                        type="button"
                                        className="remover-interesse"
                                        onClick={() =>
                                            removerInteresse(interesse)
                                        }
                                    >
                                        ×
                                    </button>
                                </div>
                            )
                        )
                    }
                </div>
            </div>
            <div className="resultado-oportunidades">
                <div className="aba-filtro">
                    <span className="num-oportunidade">120 oportunidades encontradas</span>
                    <div className="filtro">
                        <button>Ordenar por score <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"><path fill="#000" d="m13 16.172l5.364-5.364l1.414 1.414L12 20l-7.778-7.778l1.414-1.414L11 16.172V4h2z"/></svg></button>
                    </div>
                </div>
                <div className="busca-oportunidades">
                    <div className="oportunidade-buscada">
                        <div className="nomes">
                            <span className="titulo-oportunidade">Edital Inovação Agro 2026</span>
                            <span className="sub-titulo-oportunidade">EMBRAPA · Chamada pública · Nacional</span>
                        </div>
                        <div className="avaliacao">
                            <span className="texto-avaliacao">9.1</span>
                        </div>
                        <span className="data">10/05/2026</span>
                        <button className="button-ver">Ver</button>
                    </div>
                    <div className="oportunidade-buscada">
                        <div className="nomes">
                            <span className="titulo-oportunidade">Edital Inovação Agro 2026</span>
                            <span className="sub-titulo-oportunidade">EMBRAPA · Chamada pública · Nacional</span>
                        </div>
                        <div className="avaliacao">
                            <span className="texto-avaliacao">9.1</span>
                        </div>
                        <span className="data">10/05/2026</span>
                        <button className="button-ver">Ver</button>
                    </div>
                    <div className="oportunidade-buscada">
                        <div className="nomes">
                            <span className="titulo-oportunidade">Edital Inovação Agro 2026</span>
                            <span className="sub-titulo-oportunidade">EMBRAPA · Chamada pública · Nacional</span>
                        </div>
                        <div className="avaliacao">
                            <span className="texto-avaliacao">9.1</span>
                        </div>
                        <span className="data">10/05/2026</span>
                        <button className="button-ver">Ver</button>
                    </div>
                    <div className="oportunidade-buscada">
                        <div className="nomes">
                            <span className="titulo-oportunidade">Edital Inovação Agro 2026</span>
                            <span className="sub-titulo-oportunidade">EMBRAPA · Chamada pública · Nacional</span>
                        </div>
                        <div className="avaliacao">
                            <span className="texto-avaliacao">9.1</span>
                        </div>
                        <span className="data">10/05/2026</span>
                        <button className="button-ver">Ver</button>
                    </div>
                    <div className="oportunidade-buscada">
                        <div className="nomes">
                            <span className="titulo-oportunidade">Edital Inovação Agro 2026</span>
                            <span className="sub-titulo-oportunidade">EMBRAPA · Chamada pública · Nacional</span>
                        </div>
                        <div className="avaliacao">
                            <span className="texto-avaliacao">9.1</span>
                        </div>
                        <span className="data">10/05/2026</span>
                        <button className="button-ver">Ver</button>
                    </div>
                </div>
            </div>
        </div>
    )  
}

export default Oportunidades