
import './oportunidade.css';

function Oportunidades() {
    return(
        <div className="oportunidades">
            <div className="home-buscar">
                <span className='titulo-oportunidade-buscar'>ENCONTRE OPORTUNIDADES</span>
                <input type="text" placeholder="Buscar editais, licitações, chamadas públicas..." />
                <div className="areas">
                    <div className="area">
                        <span className="nome-area">Agronegócio</span>
                    </div>
                    <div className="area">
                        <span className="nome-area">Tecnologia</span>
                    </div>
                    <div className="area">
                        <span className="nome-area">Saúde</span>
                    </div>
                    <div className="area">
                        <span className="nome-area">Infraestrutura</span>
                    </div>
                    <div className="area">
                        <span className="nome-area">Educação</span>
                    </div>
                    <div className="area">
                        <span className="nome-area">inovação</span>
                    </div>
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