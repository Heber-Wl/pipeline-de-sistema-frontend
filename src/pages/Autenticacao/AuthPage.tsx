import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import type { ReactNode, InputHTMLAttributes, SelectHTMLAttributes, ChangeEvent } from "react";

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
};

type Step2Props = {
  onNext: () => void;
  onBack: () => void;
};

type Step3Props = {
  onBack: () => void;
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

      <PrimaryButton onClick={() => navigate('/dashboard')}>Entrar</PrimaryButton>

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
function Step1({ onNext, onSwitch }: Step1Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const set =
    (k: string) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setForm({
        ...form,
        [k]: e.target.value,
      });

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
          value={form.name}
          onChange={set("name")}
        />
      </Field>

      <Field label="E-mail corporativo">
        <Input
          type="email"
          placeholder="voce@empresa.com.br"
          value={form.email}
          onChange={set("email")}
        />
      </Field>

      <Field label="Senha">
        <Input
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={form.password}
          onChange={set("password")}
        />
      </Field>

      <Field label="Confirmar senha">
        <Input
          type="password"
          placeholder="Repita a senha"
          value={form.confirm}
          onChange={set("confirm")}
        />
      </Field>

      <PrimaryButton onClick={onNext}>
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

function Step2({ onNext, onBack }: Step2Props) {
  const [cnpj, setCnpj] = useState("");

  const [form, setForm] = useState({
    razao: "",
    porte: "",
    setor: "",
    site: "",
    telefone: "",
  });

  const set =
    (k: string) =>
    (
      e:
        | ChangeEvent<HTMLInputElement>
        | ChangeEvent<HTMLSelectElement>
    ) =>
      setForm({
        ...form,
        [k]: e.target.value,
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
          value={form.razao}
          onChange={set("razao")}
        />
      </Field>

      <Field label="CNPJ">
        <Input
          type="text"
          placeholder="00.000.000/0000-00"
          value={cnpj}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setCnpj(maskCNPJ(e.target.value))
          }
          maxLength={18}
        />
      </Field>

      <div style={styles.fieldRow}>
        <Field label="Porte">
          <Select
            value={form.porte}
            onChange={set("porte")}
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
            value={form.setor}
            onChange={set("setor")}
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
          value={form.site}
          onChange={set("site")}
        />
      </Field>

      <Field label="Telefone / WhatsApp">
        <Input
          type="text"
          placeholder="(00) 00000-0000"
          value={form.telefone}
          onChange={set("telefone")}
        />
      </Field>

      <PrimaryButton onClick={onNext}>
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

function Step3({ onBack }: Step3Props) {
  const [form, setForm] = useState({
    uf: "",
    cidade: "",
    faturamento: "",
    origem: "",
  });

  const [terms, setTerms] = useState(false);

  const set =
    (k: string) =>
    (
      e:
        | ChangeEvent<HTMLInputElement>
        | ChangeEvent<HTMLSelectElement>
    ) =>
      setForm({
        ...form,
        [k]: e.target.value,
      });

  const ufs = [
    "AL",
    "BA",
    "CE",
    "DF",
    "GO",
    "MA",
    "MG",
    "MS",
    "MT",
    "PA",
    "PB",
    "PE",
    "PI",
    "PR",
    "RJ",
    "RN",
    "RS",
    "SC",
    "SE",
    "SP",
    "TO",
  ];

  return (
    <>
      <p style={styles.formTitle}>
        Localização e perfil
      </p>

      <p style={styles.formSubtitle}>
        Últimos detalhes para personalizar suas oportunidades
      </p>

      <div style={styles.fieldRow}>
        <Field label="Estado (UF)">
          <Select value={form.uf} onChange={set("uf")}>
            <option value="" disabled>
              UF
            </option>

            {ufs.map((uf) => (
              <option key={uf}>{uf}</option>
            ))}
          </Select>
        </Field>

        <Field label="Cidade">
          <Input
            type="text"
            placeholder="Sua cidade"
            value={form.cidade}
            onChange={set("cidade")}
          />
        </Field>
      </div>

      <Field label="Faturamento anual estimado">
        <Select
          value={form.faturamento}
          onChange={set("faturamento")}
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
          value={form.origem}
          onChange={set("origem")}
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
        <PrimaryButton>
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

  return (
    <div style={styles.formWrap}>
      <StepIndicator current={step} />

      {step === 1 && (
        <Step1
          onNext={() => setStep(2)}
          onSwitch={onSwitch}
        />
      )}

      {step === 2 && (
        <Step2
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <Step3 onBack={() => setStep(2)} />
      )}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.brandDotRow}>
          <div style={styles.brandDot} />

          <span style={styles.brandName}>
            Sistema
          </span>
        </div>

        <p style={styles.brandDesc}>
          Encontre as melhores oportunidades
          para sua empresa crescer.
        </p>
      </div>

      <span style={styles.brandFooter}>
        © 2026 Sistema
      </span>
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
  bg: "#ffffff",
  bgCard: "#ffffff",
  bgInput: "#f9f9fb",
  bgInputFocus: "#ffffff",
  border: "#e2e2e8",
  borderFocus: "#4f8ef7",
  sidebar: "#1e293b",
  accent: "#4f8ef7",
  accentHover: "#3a7de8",
  textPrimary: "#111118",
  textSecondary: "#5a5a72",
  textTertiary: "#9898b0",
  textSidebar: "#ffffff",
  textSidebarMuted: "#666688",
  textSidebarFaint: "#44445a",
};

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    width: "100%",
    background: colors.bg,
    fontFamily:
      "'DM Sans', 'Segoe UI', sans-serif",
  },

  sidebar: {
    width: "22%",
    minWidth: "280px",
    maxWidth: "380px",
    background: colors.sidebar,
    display: "flex",
    flexDirection: "column" as const,
    padding: "40px",
    justifyContent: "space-between",
  },

  brand: {
    display: "flex",
    flexDirection: "column" as const,
    minHeight: "70vh",
    marginTop: 40,
    gap: 10,
  },

  brandDotRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  brandDot: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: colors.accent,
  },

  brandName: {
    color: colors.textSidebar,
    fontSize: 30,
    fontWeight: 600,
  },

  brandDesc: {
    fontSize: 18,
    color: colors.textSidebarMuted,
    lineHeight: 1.65,
    marginTop: 8,
  },

  brandFooter: {
    fontSize: 18,
    color: colors.textSidebarFaint,
  },

  rightPanel: {
    width: "78%",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "4%",
    background: colors.bgCard,
    // overflowY: "auto" as const,
  },

  tabs: {
    display: "flex",
    width: "100%",
    maxWidth: "650px",
    borderBottom: `1px solid ${colors.border}`,
    marginBottom: 40,
  },

  tab: {
    flex: 1,
    padding: "10px 0",
    fontSize: 18,
    fontWeight: 600,
    textAlign: "center" as const,
    cursor: "pointer",
    color: colors.textTertiary,
    borderBottom: "2px solid transparent",
    transition: "color 0.15s, border-color 0.15s",
  },

  tabActive: {
    color: colors.accent,
    borderBottom: `2px solid ${colors.accent}`,
  },

  formWrap: {
    width: "100%",
    maxWidth: 650,
  },

  formTitle: {
    fontSize: "2.2rem",
    fontWeight: 500,
    color: colors.textPrimary,
    marginBottom: 4,
  },

  formSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 24,
  },

  stepIndicator: {
    display: "flex",
    gap: 6,
    marginBottom: 24,
  },

  step: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    background: colors.border,
  },

  stepDone: {
    background: colors.accent,
  },

  field: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 5,
    marginBottom: 13,
  },

  fieldRow: {
    display: "flex",
    gap: 10,
  },

  label: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: 500,
    letterSpacing: "0.03em",
  },

  input: {
    width: "100%",
    padding: "1rem",
    fontSize: "1rem",
    background: colors.bgInput,
    border: `0.5px solid ${colors.border}`,
    borderRadius: 8,
    color: colors.textPrimary,
    outline: "none",
    fontFamily: "inherit",
    transition:
      "border-color 0.15s, box-shadow 0.15s",
  },

  inputFocused: {
    borderColor: colors.borderFocus,
    boxShadow: "0 0 0 3px rgba(79,142,247,0.1)",
    background: colors.bgInputFocus,
  },

  select: {
    color: colors.textSecondary,
    cursor: "pointer",
    appearance: "none" as const,
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239898b0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    paddingRight: 28,
  },

  btnPrimary: {
    width: "100%",
    padding: "1rem",
    fontSize: "1rem",
    fontWeight: 500,
    background: colors.accent,
    border: "none",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 8,
    transition: "background 0.15s",
  },

  btnPrimaryHover: {
    background: colors.accentHover,
  },

  forgot: {
    textAlign: "right" as const,
    marginTop: -6,
    marginBottom: 8,
  },

  link: {
    fontSize: 12,
    color: colors.accent,
    cursor: "pointer",
  },

  switchLink: {
    textAlign: "center" as const,
    marginTop: 16,
    fontSize: 13,
    color: colors.textSecondary,
  },

  checkboxRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 4,
  },

  checkbox: {
    marginTop: 2,
    accentColor: colors.accent,
    cursor: "pointer",
  },

  checkboxLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 1.5,
    cursor: "pointer",
  },
};