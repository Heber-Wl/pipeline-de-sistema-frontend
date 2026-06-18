# Sistema de Oportunidades para Empresas

Plataforma web desenvolvida para auxiliar empresas na busca e acompanhamento de editais, licitações, chamadas públicas e oportunidades de negócio.

## Tecnologias Utilizadas

### Front-end

* React
* TypeScript
* Vite
* React Router
* Axios

### Back-end

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL

---

## Pré-requisitos

Antes de iniciar o projeto, certifique-se de possuir instalado:

* Node.js 18+;
* npm;
* Git.

Verifique as versões instaladas:

```bash
node -v
npm -v
```

---

## Clonando o Projeto

```bash
git clone <https://github.com/Heber-Wl/pipeline-de-sistema-frontend>
```

Acesse a pasta do projeto:

```bash
cd nome-do-projeto
```

---

## Instalando as Dependências

Execute o comando abaixo para instalar todas as dependências do front-end:

```bash
npm install
```

---

## Configuração da API

Verifique se a URL da API está configurada corretamente no arquivo responsável pela conexão com o backend.

Exemplo:

```ts
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000"
});

export default api;
```

---

## Executando o Projeto

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Após a inicialização, o Vite exibirá um endereço semelhante a:

```text
Local: http://localhost:5173
```

Abra o navegador e acesse:

```text
http://localhost:5173
```

---

## Build de Produção

Para gerar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta:

```text
dist/
```

---

## Visualizando a Build Localmente

Após gerar a build:

```bash
npm run preview
```

---

## Estrutura do Projeto

```text
src/
│
├── assets/
├── components/
├── pages/
├── services/
├── routes/
├── styles/
│
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

---

## Funcionalidades

* Cadastro de empresas;
* Login e autenticação de usuários;
* Gerenciamento de perfil empresarial;
* Seleção de interesses;
* Busca de oportunidades;
* Sistema de recomendação por interesses;
* Visualização de editais e chamadas públicas;
* Ranking por score de aderência.

---

## Scripts Disponíveis

### Ambiente de Desenvolvimento

```bash
npm run dev
```

## Equipe

Projeto desenvolvido para centralizar e recomendar oportunidades para empresas, conectando organizações a editais, licitações e chamadas públicas relevantes para seu perfil e interesses.
