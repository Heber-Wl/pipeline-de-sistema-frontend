import Menu from '../../components/layout/Menu';
import './dashboard.css';

function Dashboard() {
    return (
        <Menu>
            <div className='dash'>
                <div className="dash-home">
                    <input name='opotunidades' type="text" placeholder='Buscas oportunidades...' />
                    <div className="user">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill="#1e293b" d="M11 7c0 1.66-1.34 3-3 3S5 8.66 5 7s1.34-3 3-3s3 1.34 3 3"/><path fill="#1e293b" fill-rule="evenodd" d="M16 8c0 4.42-3.58 8-8 8s-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8M4 13.75C4.16 13.484 5.71 11 7.99 11c2.27 0 3.83 2.49 3.99 2.75A6.98 6.98 0 0 0 14.99 8c0-3.87-3.13-7-7-7s-7 3.13-7 7c0 2.38 1.19 4.49 3.01 5.75" clip-rule="evenodd"/></svg>

                    </div>
                </div>
                <h1>Dashboard</h1>
                <div className="card-info">
                    <div className="card">
                        <span className='info'>Total</span>
                        <span className='resultado'>120</span>
                    </div>
                    <div className="card">
                        <span className='info'>Novas</span>
                        <span className='resultado'>15</span>
                    </div>
                    <div className="card">
                        <span className='info'>Média Score</span>
                        <span className='resultado'>7.8</span>
                    </div>
                </div>
                <h2>Top Oportunidades</h2>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Score</th>
                            <th>Prazo</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Edital inivação Agro</td>
                            <td className='score'>9.1</td>
                            <td>10/05/2026</td>
                            <td>
                                <button>Ver</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Programa Sustentabilidade</td>
                            <td className='score red'>7.0</td>
                            <td>20/05/2026</td>
                            <td>
                                <button>Ver</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Edital Tecnologia IA</td>
                            <td className='score'>8.5</td>
                            <td>15/05/2026</td>
                            <td>
                                <button>Ver</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Menu>
    )
}

export default Dashboard