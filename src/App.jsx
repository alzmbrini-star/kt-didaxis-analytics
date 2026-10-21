import { useEffect, useMemo, useState } from "react";

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

const demoMetrics = [
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

function formatNumber(value) {
  return Number(value || 0).toLocaleString("pt-BR");
}

function formatPercent(value) {
  return `${Number(value || 0).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}

function dashboardMetrics(liveData) {
  const counts = liveData?.counts;
  if (!counts) return demoMetrics;
  return [
    ["USUÁRIOS", formatNumber(counts.users), `${formatNumber(counts.activeUsers)} ativos · ${formatNumber(counts.inactiveUsers)} inativos · ${formatNumber(counts.blockedUsers)} bloq.`, "♙"],
    ["CURSOS", formatNumber(counts.courses), "cursos únicos", "▤"],
    ["MATRÍCULAS", formatNumber(counts.enrollments), "total no período", "◎"],
    ["TAXA DE CONCLUSÃO", formatPercent(counts.completionRate), `${formatNumber(counts.completedEnrollments)} concluídas`, "↗"],
    ["PROGRESSO MÉDIO", formatPercent(counts.averageProgress), "média das matrículas", "▥"],
    ["TRILHAS", formatNumber(counts.trails), `${formatNumber(counts.activeTrails)} ativas`, "⌁"],
    ["MEETINGS", formatNumber(counts.meetings), "reuniões disponíveis", "▣"],
    ["CERTIFICAÇÕES", formatNumber(counts.certifications), `${formatNumber(counts.issuedCertifications)} emitidas`, "✹"],
  ];
}

function Dashboard({ liveData, loading, error }) {
  const max = Math.max(...courses.map(([, value]) => value));
  const metrics = dashboardMetrics(liveData);
  return (
    <>
      {(loading || error) && <div className={`integration-banner ${error ? "error" : ""}`}>{error || "Consultando a API do tenant…"}</div>}
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
  const [tenants, setTenants] = useState([]);
  const [activeTenantId, setActiveTenantId] = useState("");
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const subtitle = useMemo(() => current === "Dashboard" ? "Acompanhe os principais indicadores do período selecionado." : `Visão recuperada de ${current.toLowerCase()}.`, [current]);
  const activeTenant = tenants.find((tenant) => tenant.id === activeTenantId);

  useEffect(() => {
    fetch("/api/admin/tenants")
      .then(async (response) => {
        if (!response.ok) throw new Error("Não foi possível carregar os tenants configurados.");
        return response.json();
      })
      .then((payload) => {
        const available = (payload.tenants || []).filter((tenant) => tenant.status === "active");
        setTenants(available);
        setActiveTenantId((currentId) => currentId || available[0]?.id || "");
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  useEffect(() => {
    if (!activeTenantId) return;
    const query = new URLSearchParams({ tenantId: activeTenantId, section: "base" });
    if (reloadKey) query.set("refresh", "1");
    setLoading(true);
    setError("");
    fetch(`/api/lms/dashboard?${query}`)
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "Falha ao consultar a API Didaxis.");
        return payload;
      })
      .then(setLiveData)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [activeTenantId, reloadKey]);

  const tenantName = activeTenant?.name || "Demonstração local";
  const connectionLabel = liveData?.live ? "API CONECTADA" : activeTenantId ? "AGUARDANDO API" : "SEM CREDENCIAIS";
  return (
    <div className="app-shell">
      <Sidebar current={current} onSelect={setCurrent} />
      <main>
        <header>
          <div className="filters"><label>▥ <select value={activeTenantId} onChange={(event) => setActiveTenantId(event.target.value)} disabled={!tenants.length}>{tenants.length ? tenants.map((tenant) => <option key={tenant.id} value={tenant.id}>{tenant.name}</option>) : <option value="">Nenhum tenant configurado</option>}</select></label><label>▣ <select><option>Todo o histórico</option><option>Últimos 30 dias</option></select></label></div>
          <label className="search">⌕ <input placeholder="Buscar no portal…" /><kbd>Ctrl K</kbd></label>
          <button className="bell" aria-label="Notificações">♧</button>
          <button className="profile"><span>AL</span><i>Administrador<small>versão local</small></i><b>⌄</b></button>
        </header>
        <div className="content">
          <div className="title-row"><div><p className="eyebrow">{tenantName.toUpperCase()} · TODO O HISTÓRICO <span>● {connectionLabel}</span></p><h1>{current}</h1><p>{subtitle}</p></div><button className="refresh" disabled={loading || !activeTenantId} onClick={() => setReloadKey((value) => value + 1)}>⟳ {loading ? "Atualizando…" : "Atualizar dados"}</button></div>
          {current === "Dashboard" ? <Dashboard liveData={liveData} loading={loading} error={error} /> : <Placeholder title={current} />}
        </div>
      </main>
    </div>
  );
}
