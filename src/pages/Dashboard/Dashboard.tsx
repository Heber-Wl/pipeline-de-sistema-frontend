import './dashboard.css';
import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';

type Oportunidade = {
    id: number;
    title: string;
    description?: string;
    organization?: string;
    deadline?: string;
    link?: string;
    location?: string;
    collected_at?: string;
    source?: {
        id: number;
        name: string;
        base_url: string;
    } | null;
    analysis?: {
        relevance_score?: number;
        summary?: string;
        recommended_action?: string;
    } | null;
};

function Dashboard() {
    const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);
    const [busca, setBusca] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        carregarOportunidades();
    }, []);

    const carregarOportunidades = async () => {
        try {
            setCarregando(true);
            setErro("");

            const response = await api.get("/opportunities", {
                params: {
                    page_size: 100
                }
            });

            setOportunidades(response.data.results || []);
        } catch (error) {
            console.error(error);
            setErro("Erro ao carregar dados do dashboard.");
        } finally {
            setCarregando(false);
        }
    };

    const getScore = (oportunidade: Oportunidade) => {
        return oportunidade.analysis?.relevance_score || 0;
    };

    const getFonte = (oportunidade: Oportunidade) => {
        return oportunidade.organization || oportunidade.source?.name || "Fonte não informada";
    };

    const formatarData = (data?: string) => {
        if (!data) {
            return "Sem prazo";
        }

        return new Date(data).toLocaleDateString("pt-BR");
    };

    const calcularDiasRestantes = (data?: string) => {
        if (!data) {
            return null;
        }

        const hoje = new Date();
        const prazo = new Date(data);

        hoje.setHours(0, 0, 0, 0);
        prazo.setHours(0, 0, 0, 0);

        const diferenca = prazo.getTime() - hoje.getTime();

        return Math.ceil(diferenca / (1000 * 60 * 60 * 24));
    };

    const oportunidadesFiltradas = useMemo(() => {
        const termo = busca.toLowerCase().trim();

        if (!termo) {
            return oportunidades;
        }

        return oportunidades.filter((oportunidade) => {
            return (
                oportunidade.title?.toLowerCase().includes(termo) ||
                oportunidade.description?.toLowerCase().includes(termo) ||
                oportunidade.organization?.toLowerCase().includes(termo) ||
                oportunidade.location?.toLowerCase().includes(termo) ||
                oportunidade.analysis?.summary?.toLowerCase().includes(termo)
            );
        });
    }, [busca, oportunidades]);

    const oportunidadesOrdenadas = useMemo(() => {
        return [...oportunidadesFiltradas].sort(
            (a, b) => getScore(b) - getScore(a)
        );
    }, [oportunidadesFiltradas]);

    const topOportunidades = oportunidadesOrdenadas.slice(0, 8);

    const vencendoEmBreve = useMemo(() => {
        return oportunidades
            .filter((oportunidade) => {
                const dias = calcularDiasRestantes(oportunidade.deadline);
                return dias !== null && dias >= 0 && dias <= 7;
            })
            .sort((a, b) => {
                const diasA = calcularDiasRestantes(a.deadline) ?? 999;
                const diasB = calcularDiasRestantes(b.deadline) ?? 999;
                return diasA - diasB;
            })
            .slice(0, 5);
    }, [oportunidades]);

    const rankingFontes = useMemo(() => {
        const mapa = new Map<string, {
            fonte: string;
            total: number;
            somaScore: number;
            melhorScore: number;
        }>();

        oportunidades.forEach((oportunidade) => {
            const fonte = getFonte(oportunidade);
            const score = getScore(oportunidade);

            const atual = mapa.get(fonte) || {
                fonte,
                total: 0,
                somaScore: 0,
                melhorScore: 0
            };

            atual.total += 1;
            atual.somaScore += score;
            atual.melhorScore = Math.max(atual.melhorScore, score);

            mapa.set(fonte, atual);
        });

        return Array.from(mapa.values())
            .map((item) => ({
                ...item,
                mediaScore: item.total > 0 ? item.somaScore / item.total : 0
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
    }, [oportunidades]);

    const total = oportunidades.length;

    const altaPrioridade = oportunidades.filter(
        oportunidade => getScore(oportunidade) >= 8
    ).length;

    const mediaScore = total > 0
        ? oportunidades.reduce((acc, oportunidade) => acc + getScore(oportunidade), 0) / total
        : 0;

    const melhorScore = oportunidades.length > 0
        ? Math.max(...oportunidades.map(getScore))
        : 0;

    const semPrazo = oportunidades.filter(
        oportunidade => !oportunidade.deadline
    ).length;

    const abrirOportunidade = (link?: string) => {
        if (!link) {
            alert("Link da oportunidade não disponível.");
            return;
        }

        window.open(link, "_blank");
    };

    const getClasseScore = (score: number) => {
        if (score >= 8) return "score alto";
        if (score >= 6) return "score medio";
        return "score baixo";
    };

    return (
        <div className="dash">
            <div className="dash-topbar">
                <div className="campo-busca-dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <path fill="currentColor" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
                    </svg>

                    <input
                        name="oportunidades"
                        type="text"
                        placeholder="Buscar oportunidades..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>

                <button
                    type="button"
                    className="botao-atualizar-dashboard"
                    onClick={carregarOportunidades}
                    disabled={carregando}
                >
                    {carregando ? "Atualizando..." : "Atualizar"}

                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 20q-3.35 0-5.675-2.325T4 12q0-3.35 2.325-5.675T12 4q1.725 0 3.3.713T18 6.7V4h2v7h-7V9h4.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12t1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.625-2.85 4.313T12 20" />
                    </svg>
                </button>
            </div>

            <div className="dash-header">
                <div>
                    <span className="dash-label">Visão geral</span>
                    <h1>Dashboard</h1>
                </div>

                <p>
                    Acompanhe oportunidades coletadas, scores, prazos e fontes mais relevantes.
                </p>
            </div>

            {erro && (
                <div className="alerta-erro">
                    {erro}
                </div>
            )}

            <div className="card-info">
                <div className="card">
                    <div className="card-icon azul">
                        📁
                    </div>

                    <div>
                        <span className="info">Total</span>
                        <span className="resultado">{total}</span>
                        <small>Oportunidades no banco</small>
                    </div>
                </div>

                <div className="card">
                    <div className="card-icon verde">
                        ↑
                    </div>

                    <div>
                        <span className="info">Alta prioridade</span>
                        <span className="resultado">{altaPrioridade}</span>
                        <small>Score maior ou igual a 8</small>
                    </div>
                </div>

                <div className="card">
                    <div className="card-icon laranja">
                        ⏱
                    </div>

                    <div>
                        <span className="info">Vencendo em 7 dias</span>
                        <span className="resultado">{vencendoEmBreve.length}</span>
                        <small>Exigem atenção rápida</small>
                    </div>
                </div>

                <div className="card">
                    <div className="card-icon roxo">
                        ▥
                    </div>

                    <div>
                        <span className="info">Média Score</span>
                        <span className="resultado">{mediaScore.toFixed(1)}</span>
                        <small>Média geral de aderência</small>
                    </div>
                </div>

                <div className="card">
                    <div className="card-icon amarelo">
                        ☆
                    </div>

                    <div>
                        <span className="info">Melhor Score</span>
                        <span className="resultado">{melhorScore.toFixed(1)}</span>
                        <small>Maior nota encontrada</small>
                    </div>
                </div>

                <div className="card">
                    <div className="card-icon vermelho">
                        📅
                    </div>

                    <div>
                        <span className="info">Sem prazo</span>
                        <span className="resultado">{semPrazo}</span>
                        <small>Precisam de revisão manual</small>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <section className="dashboard-box dashboard-box-large">
                    <div className="secao-topo">
                        <div>
                            <h2>Top Oportunidades</h2>
                            <span>Melhores oportunidades encontradas</span>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Fonte</th>
                                    <th>Score</th>
                                    <th>Prazo</th>
                                    <th>Recomendação</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>

                            <tbody>
                                {!carregando && topOportunidades.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="sem-dados">
                                            Nenhuma oportunidade encontrada.
                                        </td>
                                    </tr>
                                )}

                                {topOportunidades.map((oportunidade) => {
                                    const score = getScore(oportunidade);

                                    return (
                                        <tr key={oportunidade.id}>
                                            <td>
                                                <div className="titulo-tabela">
                                                    <strong>{oportunidade.title}</strong>
                                                    <span>
                                                        {oportunidade.analysis?.summary || "Sem resumo de análise."}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                {getFonte(oportunidade)}
                                            </td>

                                            <td>
                                                <span className={getClasseScore(score)}>
                                                    {score.toFixed(1)}
                                                </span>
                                            </td>

                                            <td>
                                                {formatarData(oportunidade.deadline)}
                                            </td>

                                            <td>
                                                <span className="badge-recomendacao">
                                                    {oportunidade.analysis?.recommended_action || "Analisar"}
                                                </span>
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="botao-ver"
                                                    onClick={() => abrirOportunidade(oportunidade.link)}
                                                >
                                                    Ver
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="dashboard-box">
                    <div className="secao-topo">
                        <div>
                            <h2>Vencendo em breve</h2>
                            <span>Próximos 7 dias</span>
                        </div>
                    </div>

                    <div className="lista-resumo">
                        {vencendoEmBreve.length === 0 && (
                            <span className="sem-dados-lista">
                                Nenhuma oportunidade vencendo em breve.
                            </span>
                        )}

                        {vencendoEmBreve.map((oportunidade) => {
                            const dias = calcularDiasRestantes(oportunidade.deadline);
                            const score = getScore(oportunidade);

                            return (
                                <div className="item-resumo" key={oportunidade.id}>
                                    <div>
                                        <strong>{oportunidade.title}</strong>
                                        <span>
                                            Score {score.toFixed(1)} · {getFonte(oportunidade)}
                                        </span>
                                    </div>

                                    <span className="badge-dias">
                                        {dias === 0 ? "Hoje" : `${dias} dias`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="dashboard-box">
                    <div className="secao-topo">
                        <div>
                            <h2>Fontes</h2>
                            <span>Origem das oportunidades</span>
                        </div>
                    </div>

                    <div className="fonte-table">
                        <div className="fonte-row fonte-head">
                            <span>Fonte</span>
                            <span>Total</span>
                            <span>Média</span>
                            <span>Melhor</span>
                        </div>

                        {rankingFontes.length === 0 && (
                            <span className="sem-dados-lista">
                                Nenhuma fonte encontrada.
                            </span>
                        )}

                        {rankingFontes.map((fonte) => (
                            <div className="fonte-row" key={fonte.fonte}>
                                <strong>{fonte.fonte}</strong>
                                <span>{fonte.total}</span>
                                <span>{fonte.mediaScore.toFixed(1)}</span>
                                <span className="fonte-score">{fonte.melhorScore.toFixed(1)}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <footer className="dash-footer">
                © 2026 Inteligência de Editais. Todos os direitos reservados.
            </footer>
        </div>
    );
}

export default Dashboard;