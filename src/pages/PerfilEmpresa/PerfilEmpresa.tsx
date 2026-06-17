import { useEffect, useState } from "react";
import api from "../../services/api";
import "./perfilEmpresa.css";

type CompanyProfile = {
    id?: number;
    name: string;
    cnpj: string;
    sector: string;
    size: string;
    location: string;
    website: string;
    phone: string;
    annual_revenue: string;
    discovery_source: string;
    interests: string[];
    created_at?: string;
};

function maskCNPJ(value: string): string {
    const v = value.replace(/\D/g, "").substring(0, 14);

    return v
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
}

function maskPhone(value: string): string {
    const v = value.replace(/\D/g, "").substring(0, 11);

    if (v.length <= 2) {
        return v;
    }

    if (v.length <= 7) {
        return v.replace(/^(\d{2})(\d+)/, "($1) $2");
    }

    return v.replace(
        /^(\d{2})(\d{5})(\d{0,4})/,
        "($1) $2-$3"
    );
}

function PerfilEmpresa() {
    const [empresa, setEmpresa] = useState<CompanyProfile>({
        name: "",
        cnpj: "",
        sector: "",
        size: "",
        location: "",
        website: "",
        phone: "",
        annual_revenue: "",
        discovery_source: "",
        interests: [],
    });

    const [interessesTexto, setInteressesTexto] = useState("");
    const [editando, setEditando] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const getUser = () => {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    };

    useEffect(() => {
        carregarPerfil();
    }, []);

    const carregarPerfil = async () => {
        try {
            setCarregando(true);
            setErro("");

            const user = getUser();

            if (!user) {
                setErro("Usuário não encontrado.");
                return;
            }

            const response = await api.get("/company/profile", {
                params: {
                    user_id: user.id,
                },
            });

            const dados = response.data;

            setEmpresa({
                id: dados.id,
                name: dados.name || "",
                cnpj: maskCNPJ(dados.cnpj || ""),
                sector: dados.sector || "",
                size: dados.size || "",
                location: dados.location || "",
                website: dados.website || "",
                phone: maskPhone(dados.phone || ""),
                annual_revenue: dados.annual_revenue || "",
                discovery_source: dados.discovery_source || "",
                interests: dados.interests || [],
                created_at: dados.created_at,
            });

            setInteressesTexto((dados.interests || []).join(", "));
        } catch (error: any) {
            console.error(error);

            setErro(
                error.response?.data?.details ||
                error.response?.data?.error ||
                "Erro ao carregar perfil da empresa."
            );
        } finally {
            setCarregando(false);
        }
    };

    const salvarPerfil = async () => {
        try {
            setSalvando(true);
            setErro("");

            const user = getUser();

            if (!user) {
                setErro("Usuário não encontrado.");
                return;
            }

            const interests = interessesTexto
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

            const response = await api.put("/company/profile", {
                user_id: user.id,
                ...empresa,
                interests,
            });

            const company = response.data.company;

            setEmpresa({
                id: company.id,
                name: company.name || "",
                cnpj: maskCNPJ(company.cnpj || ""),
                sector: company.sector || "",
                size: company.size || "",
                location: company.location || "",
                website: company.website || "",
                phone: maskPhone(company.phone || ""),
                annual_revenue: company.annual_revenue || "",
                discovery_source: company.discovery_source || "",
                interests: company.interests || [],
                created_at: company.created_at,
            });

            setInteressesTexto((company.interests || []).join(", "));
            setEditando(false);

            alert("Perfil atualizado com sucesso!");
        } catch (error: any) {
            console.error(error);

            setErro(
                error.response?.data?.details ||
                error.response?.data?.error ||
                "Erro ao salvar perfil da empresa."
            );
        } finally {
            setSalvando(false);
        }
    };

    const alterarCampo = (campo: keyof CompanyProfile, valor: string) => {
        setEmpresa({
            ...empresa,
            [campo]: valor,
        });
    };

    return (
        <div className="perfil-empresa">
            <div className="perfil-header">
                <div>
                    <span className="perfil-label">Perfil da Empresa</span>
                    <h1>{empresa.name || "Empresa"}</h1>
                    <p>
                        Visualize e atualize os dados usados pela pipeline para calcular o score das oportunidades.
                    </p>
                </div>

                <div className="perfil-actions">
                    {!editando ? (
                        <button
                            type="button"
                            className="btn-editar"
                            onClick={() => setEditando(true)}
                        >
                            Editar perfil
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="btn-cancelar"
                                onClick={() => {
                                    setEditando(false);
                                    carregarPerfil();
                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="btn-salvar"
                                onClick={salvarPerfil}
                                disabled={salvando}
                            >
                                {salvando ? "Salvando..." : "Salvar alterações"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {erro && (
                <div className="perfil-alerta">
                    {erro}
                </div>
            )}

            {carregando ? (
                <div className="perfil-loading">
                    Carregando perfil da empresa...
                </div>
            ) : (
                <div className="perfil-grid">
                    <section className="perfil-card perfil-card-principal">
                        <div className="empresa-avatar">
                            {empresa.name ? empresa.name.charAt(0).toUpperCase() : "E"}
                        </div>

                        <div>
                            <h2>{empresa.name || "Nome da empresa"}</h2>
                            <span>{empresa.sector || "Setor não informado"}</span>
                            <p>{empresa.location || "Localização não informada"}</p>
                        </div>
                    </section>

                    <section className="perfil-card">
                        <h3>Dados cadastrais</h3>

                        <div className="perfil-form-grid">
                            <Campo label="Nome da empresa" value={empresa.name} disabled={!editando} onChange={(v) => alterarCampo("name", v)} />
                            <Campo label="CNPJ" value={empresa.cnpj} disabled={!editando}  maxLength={18} onChange={(v) => alterarCampo("cnpj", maskCNPJ(v))}/>
                            <Campo label="Setor" value={empresa.sector} disabled={!editando} onChange={(v) => alterarCampo("sector", v)} />
                            <Campo label="Porte" value={empresa.size} disabled={!editando} onChange={(v) => alterarCampo("size", v)} />
                            <Campo label="Localização" value={empresa.location} disabled={!editando} onChange={(v) => alterarCampo("location", v)} />
                           <Campo label="Telefone" value={empresa.phone} disabled={!editando} maxLength={15} onChange={(v) => alterarCampo("phone", maskPhone(v))}/>
                            <Campo label="Website" value={empresa.website} disabled={!editando} onChange={(v) => alterarCampo("website", v)} />
                            <Campo label="Faturamento anual" value={empresa.annual_revenue} disabled={!editando} onChange={(v) => alterarCampo("annual_revenue", v)} />
                            <Campo label="Como conheceu o sistema" value={empresa.discovery_source} disabled={!editando} onChange={(v) => alterarCampo("discovery_source", v)} />
                        </div>
                    </section>

                    <section className="perfil-card">
                        <h3>Interesses da empresa</h3>

                        <p className="perfil-card-texto">
                            Separe os interesses por vírgula. Exemplo: Inovação, Saúde, Tecnologia.
                        </p>

                        {editando ? (
                            <textarea
                                className="interesses-textarea"
                                value={interessesTexto}
                                onChange={(e) => setInteressesTexto(e.target.value)}
                                placeholder="Ex: Inovação, Saúde, Tecnologia"
                            />
                        ) : (
                            <div className="perfil-tags">
                                {empresa.interests.length === 0 && (
                                    <span className="tag-vazia">
                                        Nenhum interesse cadastrado
                                    </span>
                                )}

                                {empresa.interests.map((interesse) => (
                                    <span key={interesse} className="perfil-tag">
                                        {interesse}
                                    </span>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}

type CampoProps = {
    label: string;
    value: string;
    disabled: boolean;
    maxLength?: number;
    onChange: (valor: string) => void;
};

function Campo({ label, value, disabled, maxLength, onChange }: CampoProps) {
    return (
        <div className="perfil-campo">
            <label>{label}</label>

            <input
                value={value}
                disabled={disabled}
                maxLength={maxLength}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

export default PerfilEmpresa;