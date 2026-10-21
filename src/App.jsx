import { useMemo, useState } from "react";

const primaryItems = [
  ["Dashboard", "▦"],
  ["Visão Geral", "◔"],
  ["Usuários", "♙"],
  ["Cursos", "▤"],
  ["Trilhas", "⌁"],
  ["Certificações", "✹"],
  ["Provas", "☑"],
  ["Tempos de acesso", "◷"],
];

const metrics = [
  ["USUÁRIOS", "558", "452 ativos · 103 inativos · 3 bloq.", "♙"],
  ["CURSOS", "516", "516 ativos", "▤"],
  ["MATRÍCULAS", "17.489", "total da plataforma", "◎"],
  ["TAXA DE CONCLUSÃO", "4,3%", "747 concluídas", "↗"],
  ["PROGRESSO MÉDIO", "5,9%", "matrículas com progresso", "▥"],
  ["TRILHAS", "98", "58 ativas", "⌁"],
  ["MEETINGS", "46", "reuniões disponíveis", "▣"],
  ["CERTIFICAÇÕES", "481", "336 emitidas", "✹"],
];

const courses = [
  ["Curso de Barista", 670],
  ["Conteúdo Exemplo - Didaxis", 497],
  ["Bem Barato", 405],
  ["BIM", 396],
  ["Autocad", 386],
  ["Feedback", 379],
];

function Sidebar({ current, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="brand"><img src="/logo-portal-relat.png" alt="Didaxis" /></div>
      <nav>
        {primaryItems.map(([label, icon]) => (
          <button key={label} className={current === label ? "selected" : ""} onClick={() => onSelect(label)}>
            <i>{icon}</i><span>{label}</span>
          </button>
        ))}
        <p className="nav-section">ANÁLISE</p>
        <button onClick={() => onSelect("Análise de Usuários")}><i>⌕</i><span>Análise</span></button>
        <button disabled><i>⌖</i><span>Mapa</span><small>Sem regiões</small></button>
        <button onClick={() => onSelect("Exportações")}><i>⇩</i><span>Exportações</span></button>
        <button onClick={() => onSelect("Configurações")}><i>⚙</i><span>Configurações</span></button>
      </nav>
      <div className="sidebar-footer">
        <button><i>▥</i><span><small>Ambiente</small>Produção</span><b>⌄</b></button>
        <button><i>?</i><span>Central de ajuda</span></button>
      </div>
    </aside>
  );
}

function Dashboard() {
  const max = Math.max(...courses.map(([, value]) => value));
  return (
    <>
      <section className="metric-grid">
        {metrics.map(([label, value, note, icon]) => (
          <article className="metric-card" key={label}>
            <div><span>{label}</span><strong>{value}</strong><small>{note}</small></div>
            <i>{icon}</i>
          </article>
        ))}
      </section>
      <section className="dashboard-grid">
        <article className="panel engagement">
          <div className="panel-title"><div><h2>Evolução de engajamento</h2><p>Acessos e conclusões no período</p></div><small>01/01/2000 — hoje</small></div>
          <div className="chart" aria-label="Gráfico ilustrativo de engajamento">
            {[25, 42, 33, 68, 52, 78, 63, 88, 73, 96, 81, 92].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}
          </div>
        </article>
        <article className="panel status-panel">
          <div className="panel-title"><div><h2>Status de conclusão</h2><p>Distribuição das matrículas</p></div></div>
          <div className="donut"><b>17.489</b><small>matrículas</small></div>
          <ul><li><i className="done" />Concluídos <b>4,3%</b></li><li><i className="progress" />Em andamento <b>3,4%</b></li><li><i className="pending" />Não iniciados <b>92,3%</b></li></ul>
        </article>
        <article className="panel course-panel">
          <div className="panel-title"><div><h2>Top cursos por matrículas</h2><p>Cursos com maior volume no período</p></div></div>
          <div className="bars">{courses.map(([name, value]) => <div key={name}><span>{name}</span><div><i style={{ width: `${(value / max) * 100}%` }} /></div><b>{value}</b></div>)}</div>
        </article>
        <article className="panel recovery-note">
          <div className="panel-title"><div><h2>Versão recuperada</h2><p>Frontend reconstruído a partir dos recursos públicos do site.</p></div></div>
          <p>Os indicadores desta demonstração são estáticos. A autenticação, os tenants e os relatórios ao vivo dependem do backend original.</p>
        </article>
      </section>
    </>
  );
}

function Placeholder({ title }) {
  return <section className="panel placeholder"><span>⌑</span><h2>{title}</h2><p>A estrutura desta área foi identificada no bundle publicado. A integração de dados será reativada quando o backend ou sua documentação estiver disponível.</p></section>;
}

export default function App() {
  const [current, setCurrent] = useState("Dashboard");
  const subtitle = useMemo(() => current === "Dashboard" ? "Acompanhe os principais indicadores do período selecionado." : `Visão recuperada de ${current.toLowerCase()}.`, [current]);
  return (
    <div className="app-shell">
      <Sidebar current={current} onSelect={setCurrent} />
      <main>
        <header>
          <div className="filters"><label>▥ <select><option>Grupo Didaxis</option></select></label><label>▣ <select><option>Todo o histórico</option><option>Últimos 30 dias</option></select></label></div>
          <label className="search">⌕ <input placeholder="Buscar no portal…" /><kbd>Ctrl K</kbd></label>
          <button className="bell" aria-label="Notificações">♧</button>
          <button className="profile"><span>AL</span><i>Administrador<small>versão local</small></i><b>⌄</b></button>
        </header>
        <div className="content">
          <div className="title-row"><div><p className="eyebrow">GRUPO DIDAXIS · TODO O HISTÓRICO <span>● MODO RECUPERADO</span></p><h1>{current}</h1><p>{subtitle}</p></div><button className="refresh">⟳ Atualizar dados</button></div>
          {current === "Dashboard" ? <Dashboard /> : <Placeholder title={current} />}
        </div>
      </main>
    </div>
  );
}
