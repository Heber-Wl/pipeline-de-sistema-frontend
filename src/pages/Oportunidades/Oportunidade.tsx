import './oportunidade.css';
import { useState, useEffect } from 'react';
import api from '../../services/api';

type Oportunidade = {
    id: number;
    title: string;
    description?: string;
    organization?: string;
    deadline?: string;
    link?: string;
    location?: string;
    source?: {
        id: number;
        name: string;
        base_url: string;
    } | null;
    analysis?: {
        id?: number;
        relevance_score?: number;
        summary?: string;
        recommended_action?: string;
    } | null;
};

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

    const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);
    const [carregandoOportunidades, setCarregandoOportunidades] = useState(false);
    const [erroOportunidades, setErroOportunidades] = useState("");

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

        if (!user) {
            return;
        }

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

            setInteressesSelecionados(response.data.interests || []);

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

    const buscarOportunidades = async () => {
        try {
            setCarregandoOportunidades(true);
            setErroOportunidades("");

            const user = getUser();

            console.log("Usuário encontrado:", user);

            if (!user) {
                alert("Usuário não autenticado");
                return;
            }

            const response = await api.post("/pipeline/run", {
                user_id: user.id,
                search: buscaInteresse
            });

            console.log("Resposta da pipeline:", response.data);

            setOportunidades(response.data.results || []);

        } catch (error: any) {
            console.error("Erro ao executar pipeline:", error);
            console.error("Resposta do backend:", error.response?.data);

            setErroOportunidades(
                error.response?.data?.details ||
                error.response?.data?.error ||
                "Erro ao executar pipeline e buscar oportunidades."
            );
        } finally {
            setCarregandoOportunidades(false);
        }
    };

    const selecionarInteresse = (interesse: string) => {
        if (interessesSelecionados.includes(interesse)) {
            return;
        }

        if (interessesSelecionados.length >= 3) {
            alert("Você pode selecionar no máximo 3 interesses.");
            return;
        }

        const novosInteresses = [
            ...interessesSelecionados,
            interesse
        ];

        setInteressesSelecionados(novosInteresses);
        salvarInteresses(novosInteresses);
        setBuscaInteresse("");
    };

    const removerInteresse = (interesse: string) => {
        const novosInteresses =
            interessesSelecionados.filter(
                item => item !== interesse
            );

        setInteressesSelecionados(novosInteresses);
        salvarInteresses(novosInteresses);
    };

    const abrirOportunidade = (link?: string) => {
        if (!link) {
            alert("Link da oportunidade não disponível.");
            return;
        }

        window.open(link, "_blank");
    };

    const formatarData = (data?: string) => {
        if (!data) {
            return "Sem prazo";
        }

        return new Date(data).toLocaleDateString("pt-BR");
    };

    return (
        <div className="oportunidades">
            <div className="home-buscar">
                <span className="titulo-oportunidade-buscar">
                    ENCONTRE OPORTUNIDADES
                </span>

                <div className="campo-pesquisa-oportunidade">
                    <input
                        type="text"
                        placeholder="Pesquise um interesse..."
                        value={buscaInteresse}
                        onChange={(e) => setBuscaInteresse(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                buscarOportunidades();
                            }
                        }}
                    />

                    <button
                        type="button"
                        className="botao-lupa"
                        onClick={buscarOportunidades}
                        disabled={carregandoOportunidades}
                        title="Buscar oportunidades"
                    >
                        {carregandoOportunidades ? (
                            <span className="spinner-lupa"></span>
                        ) : (
                            "🔍"
                        )}
                    </button>
                </div>

                {
                    buscaInteresse && (
                        <div className="lista-interesses">
                            {
                                interessesFiltrados.map((interesse) => (
                                    <div
                                        key={interesse}
                                        className="item-interesse"
                                        onClick={() => selecionarInteresse(interesse)}
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
                        interessesSelecionados.map((interesse) => (
                            <div
                                key={interesse}
                                className="interesse-tag"
                            >
                                <span>{interesse}</span>

                                <button
                                    type="button"
                                    className="remover-interesse"
                                    onClick={() => removerInteresse(interesse)}
                                >
                                    ×
                                </button>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="resultado-oportunidades">
                <div className="aba-filtro">
                    <span className="num-oportunidade">
                        {oportunidades.length} oportunidades encontradas
                    </span>

                    <div className="filtro">
                        <button type="button">
                            Ordenar por score
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="17"
                                height="17"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="#000"
                                    d="m13 16.172l5.364-5.364l1.414 1.414L12 20l-7.778-7.778l1.414-1.414L11 16.172V4h2z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="busca-oportunidades">
                    {carregandoOportunidades && (
                        <div className="loading-oportunidades">
                            <span className="spinner-carregamento"></span>

                            <div>
                                <strong>Buscando oportunidades...</strong>
                                <p>Executando a pipeline, analisando editais e salvando no banco.</p>
                            </div>
                        </div>
                    )}

                    {erroOportunidades && (
                        <span>{erroOportunidades}</span>
                    )}

                    {!carregandoOportunidades && !erroOportunidades && oportunidades.length === 0 && (
                        <span>Clique na lupa para buscar e salvar oportunidades.</span>
                    )}

                    {!carregandoOportunidades && !erroOportunidades && oportunidades.map((oportunidade) => (
                        <div
                            key={oportunidade.id}
                            className="oportunidade-buscada"
                        >
                            <div className="nomes">
                                <span className="titulo-oportunidade">
                                    {oportunidade.title}
                                </span>

                                <span className="sub-titulo-oportunidade">
                                    {oportunidade.organization || oportunidade.source?.name || "Fonte não informada"}
                                    {" · "}
                                    {oportunidade.location || "Nacional"}
                                </span>
                            </div>

                            <div className="avaliacao">
                                <span className="texto-avaliacao">
                                    {oportunidade.analysis?.relevance_score?.toFixed(1) || "0.0"}
                                </span>
                            </div>

                            <span className="data">
                                {formatarData(oportunidade.deadline)}
                            </span>

                            <button
                                type="button"
                                className="button-ver"
                                onClick={() => abrirOportunidade(oportunidade.link)}
                            >
                                Ver
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Oportunidades;