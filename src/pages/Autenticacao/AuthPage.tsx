import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import type { ReactNode, InputHTMLAttributes, SelectHTMLAttributes, ChangeEvent } from "react";
import api from "../../services/api";

// ── Types ────────────────────────────────────────────────────────────────────
type FieldProps = {
  label: string;
  children: ReactNode;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
};

type PrimaryButtonProps = {
  children: ReactNode;
  onClick?: () => void;
};

type StepIndicatorProps = {
  current: number;
};

type LoginFormProps = {
  onSwitch: (tab: string) => void;
};

type Step1Props = {
  onNext: () => void;
  onSwitch: (tab: string) => void;
  formData: any;
  setFormData: any;
};

type Step2Props = {
  onNext: () => void;
  onBack: () => void;
  formData: any;
  setFormData: any;
};

type Step3Props = {
  onBack: () => void;
  onSubmit: () => void;
  formData: any;
  setFormData: any;
};

type CadastroFormProps = {
  onSwitch: (tab: string) => void;
};

type TabBarProps = {
  active: string;
  onSwitch: (tab: string) => void;
};

// ── Helpers ──────────────────────────────────────────────────────────────────
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
// ── Sub-components ────────────────────────────────────────────────────────────
function Field({ label, children }: FieldProps) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);

  return (
    <input
      {...props}
      style={{
        ...styles.input,
        ...(focused ? styles.inputFocused : {}),
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function Select({ children, ...props }: SelectProps) {
  const [focused, setFocused] = useState(false);

  return (
    <select
      {...props}
      style={{
        ...styles.input,
        ...styles.select,
        ...(focused ? styles.inputFocused : {}),
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </select>
  );
}

function PrimaryButton({
  children,
  onClick,
}: PrimaryButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.btnPrimary,
        ...(hovered ? styles.btnPrimaryHover : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

// ── Step Indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div style={styles.stepIndicator}>
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          style={{
            ...styles.step,
            ...(n <= current ? styles.stepDone : {}),
          }}
        />
      ))}
    </div>
  );
}

// ── Login Form ────────────────────────────────────────────────────────────────
function LoginForm({ onSwitch }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Preencha e-mail e senha.");
      return;
    }
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const { user, token } = response.data;

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "token",
        token
      );

      console.log(user.name);
      console.log(user.company_id);

      navigate("/dashboard");

    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.error ||
        "Erro ao realizar login."
      );
    }
  };

  return (
    <div style={styles.formWrap}>
      <p style={styles.formTitle}>Boas-vindas de volta</p>

      <p style={styles.formSubtitle}>
        Acesse sua conta para ver suas oportunidades
      </p>

      <Field label="E-mail">
        <Input
          type="email"
          placeholder="empresa@email.com"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
      </Field>

      <Field label="Senha">
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
      </Field>

      <div style={styles.forgot}>
        <span style={styles.link}>Esqueceu a senha?</span>
      </div>

      <PrimaryButton onClick={handleLogin}>Entrar</PrimaryButton>

      <p style={styles.switchLink}>
        Não tem conta?{" "}
        <span
          style={styles.link}
          onClick={() => onSwitch("cadastro")}
        >
          Crie agora
        </span>
      </p>
    </div>
  );
}

// ── Cadastro Steps ────────────────────────────────────────────────────────────
function Step1({ onSwitch, formData, setFormData, onNext }: Step1Props) {

  const set = 
    (field: string) =>
    (e: ChangeEvent<HTMLInputElement>) => 
      setFormData({
        ...formData,
        [field]: e.target.value,
      })

  return (
    <>
      <p style={styles.formTitle}>Crie sua conta</p>

      <p style={styles.formSubtitle}>
        Comece pelo acesso — leva menos de 2 minutos
      </p>

      <Field label="Nome completo">
        <Input
          type="text"
          placeholder="Seu nome"
          value={formData.name}
          onChange={set("name")}
        />
      </Field>

      <Field label="E-mail corporativo">
        <Input
          type="email"
          placeholder="voce@empresa.com.br"
          value={formData.email}
          onChange={set("email")}
        />
      </Field>

      <Field label="Senha">
        <Input
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={formData.password}
          onChange={set("password")}
        />
      </Field>

      <Field label="Confirmar senha">
        <Input
          type="password"
          placeholder="Repita a senha"
          value={formData.confirm}
          onChange={set("confirm")}
        />
      </Field>

      <PrimaryButton 
        onClick={() => {
          if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            formData.password !== formData.confirm
          ) {
            alert("Preencha todos os campos.");
            return;
          }
          if (formData.password !== formData.confirm) {
            alert("As senhas não coincidem.");
            return;
          }

          onNext();
        }}>
        Continuar →
      </PrimaryButton>

      <p style={styles.switchLink}>
        Já tem conta?{" "}
        <span
          style={styles.link}
          onClick={() => onSwitch("login")}
        >
          Entrar
        </span>
      </p>
    </>
  );
}

function Step2({ onNext, onBack, formData, setFormData }: Step2Props) {

  const set =
    (field: string) =>
    (
      e:
        | ChangeEvent<HTMLInputElement>
        | ChangeEvent<HTMLSelectElement>
    ) =>
      setFormData({
        ...formData,
        [field]: e.target.value,
      });

  return (
    <>
      <p style={styles.formTitle}>Dados da empresa</p>

      <p style={styles.formSubtitle}>
        Precisamos conhecer melhor o seu negócio
      </p>

      <Field label="Razão social">
        <Input
          type="text"
          placeholder="Nome oficial da empresa"
          value={formData.company_name}
          onChange={set("company_name")}
        />
      </Field>

      <Field label="CNPJ">
        <Input
          type="text"
          placeholder="00.000.000/0000-00"
          value={formData.cnpj}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFormData({
              ...formData,
              cnpj: maskCNPJ(e.target.value)
            })
          }
          maxLength={18}
        />
      </Field>

      <div style={styles.fieldRow}>
        <Field label="Porte">
          <Select
            value={formData.size}
            onChange={set("size")}
          >
            <option value="" disabled>
              Selecione
            </option>

            <option>MEI</option>
            <option>Microempresa (ME)</option>
            <option>Pequena (EPP)</option>
            <option>Média</option>
            <option>Grande</option>
          </Select>
        </Field>

        <Field label="Setor">
          <Select
            value={formData.sector}
            onChange={set("sector")}
          >
            <option value="" disabled>
              Selecione
            </option>

            <option>Agronegócio</option>
            <option>Tecnologia</option>
            <option>Saúde</option>
            <option>Educação</option>
            <option>Construção</option>
            <option>Indústria</option>
            <option>Serviços</option>
            <option>Outro</option>
          </Select>
        </Field>
      </div>

      <Field label="Site da empresa">
        <Input
          type="text"
          placeholder="https://suaempresa.com.br"
          value={formData.website}
          onChange={set("website")}
        />
      </Field>

      <Field label="Telefone / WhatsApp">
        <Input
          maxLength={15}
          type="text"
          placeholder="(00) 00000-0000"
          value={formData.phone}
          onChange={(e) =>
            setFormData({
              ...formData,
              phone: maskPhone(e.target.value),
            })
          }
        />
      </Field>

      <PrimaryButton 
        onClick={() => {
          if (
            !formData.company_name ||
            !formData.cnpj ||
            !formData.size ||
            !formData.sector ||
            !formData.website ||
            !formData.phone
          ) {
            alert("Preencha todos os campos.");
            return;
          }

          onNext();

        }}>
        Continuar →
      </PrimaryButton>

      <p
        style={{
          ...styles.switchLink,
          marginTop: 10,
        }}
      >
        <span style={styles.link} onClick={onBack}>
          ← Voltar
        </span>
      </p>
    </>
  );
}

function Step3({ onBack, formData, setFormData, onSubmit }: Step3Props) {

  const [terms, setTerms] = useState(false);

  const set = 
    (field: string) =>
    (
      e:
        | ChangeEvent<HTMLInputElement>
        | ChangeEvent<HTMLSelectElement>
    ) => 
      setFormData({
        ...formData,
        [field]: e.target.value,
      })

  return (
    <>
      <p style={styles.formTitle}>
        Localização e perfil
      </p>

      <p style={styles.formSubtitle}>
        Últimos detalhes para personalizar suas oportunidades
      </p>

      <div style={styles.fieldRow}>

        <Field label="Cidade">
          <Input
            type="text"
            placeholder="Sua cidade"
            value={ formData.location }
            onChange={set("location")}
          />
        </Field>
      </div>

      <Field label="Faturamento anual estimado">
        <Select
          value={formData.annual_revenue}
          onChange={set("annual_revenue")}
        >
          <option value="" disabled>
            Selecione a faixa
          </option>

          <option>Até R$ 81 mil (MEI)</option>

          <option>
            R$ 81 mil – R$ 360 mil
          </option>

          <option>
            R$ 360 mil – R$ 4,8 milhões
          </option>

          <option>
            R$ 4,8 mi – R$ 30 milhões
          </option>

          <option>Acima de R$ 30 milhões</option>
        </Select>
      </Field>

      <Field label="Como conheceu o Sistema?">
        <Select
          value={formData.discovery_source}
          onChange={set("discovery_source")}
        >
          <option value="" disabled>
            Selecione
          </option>

          <option>Indicação</option>
          <option>Google</option>
          <option>Redes sociais</option>
          <option>Evento ou feira</option>
          <option>Outro</option>
        </Select>
      </Field>

      <div style={styles.checkboxRow}>
        <input
          type="checkbox"
          id="terms"
          checked={terms}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTerms(e.target.checked)
          }
          style={styles.checkbox}
        />

        <label
          htmlFor="terms"
          style={styles.checkboxLabel}
        >
          Concordo com os{" "}
          <span style={styles.link}>
            Termos de Uso
          </span>{" "}
          e a{" "}
          <span style={styles.link}>
            Política de Privacidade
          </span>
        </label>
      </div>

      <div style={{ marginTop: 14 }}>
        <PrimaryButton
          onClick={() => {
            if (
              !formData.location ||
              !formData.annual_revenue ||
              !formData.discovery_source
            ) {
              alert("Preencha todos os campos.");
              return;
            }

            if (!terms) {
              alert("Você precisa aceitar os termos.");
              return;
            }

            onSubmit();
          }}

        >
          Criar conta
        </PrimaryButton>
      </div>

      <p
        style={{
          ...styles.switchLink,
          marginTop: 10,
        }}
      >
        <span style={styles.link} onClick={onBack}>
          ← Voltar
        </span>
      </p>
    </>
  );
}

// ── Cadastro Form ─────────────────────────────────────────────────────────────
function CadastroForm({
  onSwitch,
}: CadastroFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",

    company_name: "",
    cnpj: "",
    size: "",
    sector: "",
    website: "",
    phone: "",

    location: "",
    annual_revenue: "",
    discovery_source: "",
  });
  
  const handleRegister = async () => {
    try {
      const response = await api.post("/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,

        company_name: formData.company_name,
        cnpj: formData.cnpj,
        sector: formData.sector,
        size: formData.size,
        website: formData.website,
        phone: formData.phone,

        location: formData.location,
        annual_revenue: formData.annual_revenue,
        discovery_source: formData.discovery_source,
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        confirm: "",

        company_name: "",
        cnpj: "",
        size: "",
        sector: "",
        website: "",
        phone: "",

        location: "",
        annual_revenue: "",
        discovery_source: "",
      });

      setStep(1);
      onSwitch("login");

      alert("Cadastro realizado com sucesso!");
      console.log(response.data);

    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar.");
    }
  };

  return (
    <div style={styles.formWrap}>
      <StepIndicator current={step} />

      {step === 1 && (
        <Step1
          onNext={() => setStep(2)}
          onSwitch={onSwitch}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {step === 2 && (
        <Step2
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {step === 3 && (
        <Step3 
          onBack={() => setStep(2)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleRegister}
        />
      )}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarGlow} />

      <div style={styles.brand}>
        <div style={styles.brandDotRow}>
          <div style={styles.brandIcon}>
            <span style={styles.brandIconText}>🔎</span>
          </div>

          <div>
            <span style={styles.brandName}>
              Sistema
            </span>

            <p style={styles.brandMiniText}>
              Inteligência de oportunidades
            </p>
          </div>
        </div>

        <p style={styles.brandDesc}>
          Encontre, priorize e acompanhe oportunidades estratégicas para sua empresa crescer com mais precisão.
        </p>

        <div style={styles.sidebarBenefits}>
          <div style={styles.sidebarBenefit}>
            <span style={styles.benefitIcon}>✓</span>
            <span>Busca automatizada de editais</span>
          </div>

          <div style={styles.sidebarBenefit}>
            <span style={styles.benefitIcon}>✓</span>
            <span>Score de aderência por empresa</span>
          </div>

          <div style={styles.sidebarBenefit}>
            <span style={styles.benefitIcon}>✓</span>
            <span>Priorização por prazo e relevância</span>
          </div>
        </div>
      </div>

      <div style={styles.sidebarFooterBox}>
        <span style={styles.footerLabel}>Pipeline inteligente</span>
        <strong style={styles.footerTitle}>Prosas · PNCP · Finep</strong>
        <span style={styles.brandFooter}>© 2026 Sistema</span>
      </div>
    </div>
  );
}

// ── Tab Bar ───────────────────────────────────────────────────────────────────
function TabBar({
  active,
  onSwitch,
}: TabBarProps) {
  return (
    <div style={styles.tabs}>
      {["login", "cadastro"].map((tab) => (
        <div
          key={tab}
          style={{
            ...styles.tab,
            ...(active === tab
              ? styles.tabActive
              : {}),
          }}
          onClick={() => onSwitch(tab)}
        >
          {tab === "login"
            ? "Entrar"
            : "Criar conta"}
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const [activeTab, setActiveTab] =
    useState("login");

  return (
    <div style={styles.page}>
      <Sidebar />

      <div style={styles.rightPanel}>
        <TabBar
          active={activeTab}
          onSwitch={setActiveTab}
        />

        {activeTab === "login" ? (
          <LoginForm onSwitch={setActiveTab} />
        ) : (
          <CadastroForm
            onSwitch={setActiveTab}
          />
        )}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const colors = {
  bg: "#f8fafc",
  bgCard: "#ffffff",
  bgInput: "#f8fafc",
  bgInputFocus: "#ffffff",
  border: "#e2e8f0",
  borderFocus: "#2563eb",

  sidebar: "#0f172a",
  sidebarLight: "#1e293b",

  accent: "#2563eb",
  accentHover: "#1d4ed8",
  accentSoft: "#dbeafe",

  textPrimary: "#0f172a",
  textSecondary: "#475569",
  textTertiary: "#94a3b8",

  textSidebar: "#ffffff",
  textSidebarMuted: "#cbd5e1",
  textSidebarFaint: "#64748b",
};

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    width: "100%",
    background: colors.bg,
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },

  sidebar: {
  width: "32%",
  minWidth: "320px",
  maxWidth: "440px",
  background: "linear-gradient(160deg, #0f172a 0%, #07111f 100%)",
  display: "flex",
  flexDirection: "column" as const,
  padding: "48px 42px",
  justifyContent: "space-between",
  position: "relative" as const,
  overflow: "hidden",
},

sidebarGlow: {
  position: "absolute" as const,
  width: 260,
  height: 260,
  borderRadius: "50%",
  background: "rgba(37, 99, 235, 0.18)",
  filter: "blur(70px)",
  top: -70,
  right: -90,
},

brand: {
  display: "flex",
  flexDirection: "column" as const,
  minHeight: "70vh",
  marginTop: 30,
  gap: 18,
  position: "relative" as const,
  zIndex: 2,
},

brandDotRow: {
  display: "flex",
  alignItems: "center",
  gap: 14,
},

brandIcon: {
  width: 56,
  height: 56,
  borderRadius: 18,
  background: "rgba(219, 234, 254, 0.95)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 18px 38px rgba(37, 99, 235, 0.22)",
},

brandIconText: {
  fontSize: 26,
},

brandName: {
  color: "#ffffff",
  fontSize: 34,
  lineHeight: 1,
  fontWeight: 850,
  letterSpacing: "-0.04em",
},

brandMiniText: {
  margin: "6px 0 0",
  color: "#93c5fd",
  fontSize: 13,
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
},

brandDesc: {
  maxWidth: 330,
  fontSize: 17,
  color: "#cbd5e1",
  lineHeight: 1.7,
  marginTop: 18,
},

sidebarBenefits: {
  display: "flex",
  flexDirection: "column" as const,
  gap: 12,
  marginTop: 16,
},

sidebarBenefit: {
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "#e2e8f0",
  fontSize: 14,
},

benefitIcon: {
  width: 22,
  height: 22,
  borderRadius: "50%",
  background: "rgba(37, 99, 235, 0.22)",
  color: "#93c5fd",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 13,
  fontWeight: 900,
},

sidebarFooterBox: {
  position: "relative" as const,
  zIndex: 2,
  padding: 18,
  borderRadius: 18,
  border: "1px solid rgba(148, 163, 184, 0.22)",
  background: "rgba(15, 23, 42, 0.45)",
  backdropFilter: "blur(10px)",
  display: "flex",
  flexDirection: "column" as const,
  gap: 6,
},

footerLabel: {
  color: "#93c5fd",
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
},

footerTitle: {
  color: "#ffffff",
  fontSize: 15,
},

brandFooter: {
  fontSize: 13,
  color: "#64748b",
  marginTop: 6,
},

  rightPanel: {
    width: "68%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "48px",
    background:
      "radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 34%), #f8fafc",
  },

  tabs: {
    display: "flex",
    width: "100%",
    maxWidth: "620px",
    background: "#ffffff",
    border: `1px solid ${colors.border}`,
    borderRadius: 16,
    padding: 6,
    marginBottom: 28,
    boxShadow: "0 14px 35px rgba(15, 23, 42, 0.06)",
  },

  tab: {
    flex: 1,
    padding: "13px 0",
    fontSize: 15,
    fontWeight: 800,
    textAlign: "center" as const,
    cursor: "pointer",
    color: colors.textTertiary,
    borderRadius: 12,
    transition: "all 0.18s ease",
  },

  tabActive: {
    color: "#ffffff",
    background: colors.accent,
    boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
  },

  formWrap: {
    width: "100%",
    maxWidth: 620,
    background: "#ffffff",
    border: `1px solid ${colors.border}`,
    borderRadius: 24,
    padding: "34px",
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
  },

  formTitle: {
    fontSize: "2.1rem",
    fontWeight: 850,
    color: colors.textPrimary,
    margin: "0 0 8px",
    letterSpacing: "-0.04em",
  },

  formSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    margin: "0 0 28px",
    lineHeight: 1.55,
  },

  stepIndicator: {
    display: "flex",
    gap: 8,
    marginBottom: 28,
  },

  step: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    background: "#e2e8f0",
    transition: "0.2s ease",
  },

  stepDone: {
    background: colors.accent,
    boxShadow: "0 6px 16px rgba(37, 99, 235, 0.25)",
  },

  field: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
    marginBottom: 16,
  },

  fieldRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },

  label: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: 800,
    letterSpacing: "0.02em",
  },

  input: {
    width: "100%",
    padding: "15px 16px",
    fontSize: "0.98rem",
    background: colors.bgInput,
    border: `1px solid ${colors.border}`,
    borderRadius: 14,
    color: colors.textPrimary,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
  },

  inputFocused: {
    borderColor: colors.borderFocus,
    boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.12)",
    background: colors.bgInputFocus,
  },

  select: {
    color: colors.textSecondary,
    cursor: "pointer",
    appearance: "none" as const,
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.4'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: 40,
  },

  btnPrimary: {
    width: "100%",
    padding: "15px 18px",
    fontSize: "1rem",
    fontWeight: 850,
    background: colors.accent,
    border: "none",
    borderRadius: 14,
    color: "#fff",
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 10,
    transition: "all 0.18s ease",
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.25)",
  },

  btnPrimaryHover: {
    background: colors.accentHover,
    transform: "translateY(-1px)",
    boxShadow: "0 18px 38px rgba(37, 99, 235, 0.32)",
  },

  forgot: {
    textAlign: "right" as const,
    marginTop: -4,
    marginBottom: 10,
  },

  link: {
    fontSize: 13,
    color: colors.accent,
    cursor: "pointer",
    fontWeight: 800,
  },

  switchLink: {
    textAlign: "center" as const,
    marginTop: 18,
    fontSize: 14,
    color: colors.textSecondary,
  },

  checkboxRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 8,
    padding: 14,
    borderRadius: 14,
    background: "#f8fafc",
    border: `1px solid ${colors.border}`,
  },

  checkbox: {
    marginTop: 3,
    accentColor: colors.accent,
    cursor: "pointer",
    width: 16,
    height: 16,
  },

  checkboxLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 1.55,
    cursor: "pointer",
  },
};