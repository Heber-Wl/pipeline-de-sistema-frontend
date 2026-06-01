// App.tsx
import { Routes, Route } from "react-router-dom";

import AuthPage from "./pages/Autenticacao/AuthPage";
import Menu from "./components/layout/Menu";
import Dashboard from "./pages/Dashboard/Dashboard";
import Oportunidades from "./pages/Oportunidades/Oportunidade";

export default function App() {
  return (
    <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={
            <Menu>
                <Dashboard />
            </Menu>}
        />
        <Route path="/oportunidades*" element={
            <Menu>
                <Oportunidades />
            </Menu>
        } />
    </Routes>
  );
}