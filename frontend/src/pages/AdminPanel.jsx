import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000/api';

const NAV_ITEMS = [
  { id:'dashboard',  icon:'📊', label:'Dashboard' },
  { id:'agenda',     icon:'📅', label:'Agenda' },
  { id:'clientes',   icon:'👥', label:'Clientes' },
  { id:'servicos',   icon:'✂️',  label:'Serviços' },
  { id:'financeiro', icon:'💰', label:'Financeiro' },
];

function StatusBadge({ status }) {
  const map    = { pendente:'warning', aprovado:'primary', concluido:'success', cancelado:'danger' };
  const labels = { pendente:'Pendente', aprovado:'Aprovado', concluido:'Concluído', cancelado:'Cancelado' };
  return <span className={`badge badge-${map[status] || 'primary'}`}>{labels[status] || status}</span>;
}

function fmtHora(d) {
  return new Date(d).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
}
function fmtDinheiro(v) {
  return Number(v || 0).toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
}
function fmtData(d) {
  return new Date(d).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' });
}

/* ========================= DASHBOARD ========================= */
function Dashboard({ agendamentos, servicos }) {
  const hoje = new Date().toDateString();
  const today     = agendamentos.filter(a => new Date(a.data_hora).toDateString() === hoje);
  const concluidos = agendamentos.filter(a => a.status === 'concluido');
  const pendentes  = agendamentos.filter(a => a.status === 'pendente');
  const totalMes   = concluidos.reduce((s, a) => s + (a.valor || 0), 0);

  const barData = ['Seg','Ter','Qua','Qui','Sex','Sáb'].map((l, i) => ({
    label: l, val: [420,680,390,870,750,310][i], max: 870
  }));

  const topServicos = servicos.map(s => ({
    ...s,
    count: agendamentos.filter(a => a.servico_id === s.id).length
  })).sort((a,b) => b.count - a.count).slice(0,5);

  return (
    <div className="fade-in">
      <div className="stats-grid">
        <div className="stat-card indigo">
          <div className="stat-icon">📅</div>
          <div className="stat-val">{today.length}</div>
          <div className="stat-label-text">Agendamentos Hoje</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-icon">✅</div>
          <div className="stat-val">{concluidos.length}</div>
          <div className="stat-label-text">Concluídos</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon">⏳</div>
          <div className="stat-val">{pendentes.length}</div>
          <div className="stat-label-text">Pendentes</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">💰</div>
          <div className="stat-val">{fmtDinheiro(totalMes)}</div>
          <div className="stat-label-text">Faturamento (mês)</div>
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="chart-wrap">
          <div><div className="chart-title">💰 Faturamento Semanal</div><div className="chart-subtitle">Receita por dia da semana</div></div>
          <div className="bar-chart">
            {barData.map(b => (
              <div className="bar-item" key={b.label}>
                <div className="bar bar-primary" style={{ height:`${(b.val/b.max)*130}px` }} />
                <span className="bar-label">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-wrap">
          <div><div className="chart-title">🏆 Serviços Mais Realizados</div><div className="chart-subtitle">Ranking geral</div></div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {topServicos.map((s,i) => (
              <div key={s.id} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:28,height:28,borderRadius:'50%',background:i===0?'var(--warning)':'var(--bg-secondary)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.8rem',fontWeight:700,flexShrink:0,color:i===0?'#000':'var(--text-muted)' }}>{i+1}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:500,fontSize:'0.9rem' }}>{s.nome}</div>
                  <div style={{ height:4,background:'var(--bg-secondary)',borderRadius:2,marginTop:4 }}>
                    <div style={{ height:'100%',background:'var(--primary)',borderRadius:2,width:`${Math.max(10,(s.count/Math.max(1,agendamentos.length))*100)}%` }} />
                  </div>
                </div>
                <div style={{ fontSize:'0.85rem',color:'var(--text-muted)' }}>{s.count}x</div>
              </div>
            ))}
            {topServicos.every(s => s.count === 0) && (
              <div style={{ color:'var(--text-muted)', textAlign:'center', padding:20 }}>Nenhum agendamento ainda</div>
            )}
          </div>
        </div>
      </div>

      <div className="admin-table-wrap" style={{ marginTop:20 }}>
        <div className="admin-table-header"><span className="admin-table-title">📅 Próximos Agendamentos Hoje</span></div>
        <table>
          <thead><tr><th>Cliente / Pet</th><th>Serviço</th><th>Horário</th><th>Status</th><th>Valor</th></tr></thead>
          <tbody>
            {today.length === 0 && <tr><td colSpan={5} style={{ textAlign:'center',padding:30,color:'var(--text-muted)' }}>Nenhum agendamento hoje</td></tr>}
            {today.map(a => (
              <tr key={a.id}>
                <td><div style={{ fontWeight:500 }}>{a.nome_tutor || a.cliente_nome}</div><div style={{ fontSize:'0.8rem',color:'var(--text-muted)' }}>{a.nome_pet} ({a.especie})</div></td>
                <td>{a.servico_nome}{a.van_pet ? ' 🚐' : ''}</td>
                <td>{fmtHora(a.data_hora)}</td>
                <td><StatusBadge status={a.status} /></td>
                <td style={{ color:'var(--primary)',fontWeight:600 }}>{fmtDinheiro(a.valor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========================= AGENDA ========================= */
function Agenda({ agendamentos, onStatusChange, onDelete }) {
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const filtered = agendamentos.filter(a => {
    const d = new Date(a.data_hora).toISOString().split('T')[0];
    return d === filterDate;
  });

  return (
    <div className="fade-in">
      <div className="filters-bar">
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="form-control" style={{ maxWidth:200 }} />
        <span style={{ color:'var(--text-muted)',fontSize:'0.9rem' }}>{filtered.length} agendamento(s)</span>
      </div>
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-title">📅 Agenda — {new Date(filterDate+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</span>
        </div>
        <table>
          <thead><tr><th>Horário</th><th>Cliente / Pet</th><th>Serviço</th><th>Van Pet</th><th>Status</th><th>Valor</th><th>Ações</th></tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} style={{ textAlign:'center',padding:40,color:'var(--text-muted)' }}>Nenhum agendamento nesta data</td></tr>}
            {filtered.map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight:600,color:'var(--primary)' }}>{fmtHora(a.data_hora)}</td>
                <td><div style={{ fontWeight:500 }}>{a.nome_tutor || a.cliente_nome}</div><div style={{ fontSize:'0.8rem',color:'var(--text-muted)' }}>{a.nome_pet} ({a.especie})</div></td>
                <td>{a.servico_nome}</td>
                <td>{a.van_pet ? <span className="badge badge-success">🚐 Sim</span> : '—'}</td>
                <td><StatusBadge status={a.status} /></td>
                <td style={{ color:'var(--primary)',fontWeight:600 }}>{fmtDinheiro(a.valor)}</td>
                <td>
                  <div className="td-actions">
                    {a.status === 'pendente'  && <button className="btn btn-success btn-sm" onClick={() => onStatusChange(a.id,'aprovado')}>✅ Aprovar</button>}
                    {a.status === 'aprovado'  && <button className="btn btn-primary btn-sm" onClick={() => onStatusChange(a.id,'concluido')}>🏁 Concluir</button>}
                    {a.status !== 'cancelado' && a.status !== 'concluido' && <button className="btn btn-danger btn-sm" onClick={() => onStatusChange(a.id,'cancelado')}>✕</button>}
                    <button className="btn btn-ghost btn-sm" onClick={() => onDelete(a.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========================= CLIENTES ========================= */
function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/clientes`).then(r => setClientes(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = clientes.filter(c => c.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fade-in">
      <div className="filters-bar">
        <div className="search-input-wrap" style={{ flex:1,maxWidth:360 }}>
          <span className="search-icon">🔍</span>
          <input className="form-control" placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="admin-table-wrap">
        <div className="admin-table-header"><span className="admin-table-title">👥 Clientes Cadastrados ({filtered.length})</span></div>
        <table>
          <thead><tr><th>Nome</th><th>Telefone</th><th>Agendamentos</th><th>Cadastrado em</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={4} style={{ textAlign:'center',padding:30 }}>Carregando...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={4} style={{ textAlign:'center',padding:30,color:'var(--text-muted)' }}>Nenhum cliente cadastrado ainda</td></tr>}
            {filtered.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                    <div style={{ width:36,height:36,borderRadius:'50%',background:'var(--primary-light)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'var(--primary)',fontSize:'0.85rem' }}>{c.nome.charAt(0)}</div>
                    <span style={{ fontWeight:500 }}>{c.nome}</span>
                  </div>
                </td>
                <td>{c.telefone}</td>
                <td>{c.total_agendamentos || 0}</td>
                <td>{fmtData(c.criado_em)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========================= SERVIÇOS ========================= */
function Servicos({ servicos }) {
  function fmtDinheiro(v) {
    return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  }
  return (
    <div className="fade-in">
      <div className="admin-table-wrap">
        <div className="admin-table-header"><span className="admin-table-title">✂️ Serviços Cadastrados</span></div>
        <table>
          <thead><tr><th>Serviço</th><th>Descrição</th><th>Valor</th><th>Duração</th><th>Status</th></tr></thead>
          <tbody>
            {servicos.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight:500 }}>{s.nome}</td>
                <td style={{ color:'var(--text-secondary)',fontSize:'0.85rem' }}>{s.descricao}</td>
                <td style={{ color:'var(--primary)',fontWeight:600 }}>{fmtDinheiro(s.valor)}</td>
                <td style={{ color:'var(--text-muted)' }}>{s.duracao_minutos} min</td>
                <td><span className={`badge ${s.ativo?'badge-success':'badge-danger'}`}>{s.ativo?'● Ativo':'○ Inativo'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========================= FINANCEIRO ========================= */
function Financeiro({ agendamentos }) {
  const concluidos = agendamentos.filter(a => a.status === 'concluido');
  const totalGeral = concluidos.reduce((s,a) => s + (a.valor||0), 0);
  const todayTotal = concluidos
    .filter(a => new Date(a.data_hora).toDateString() === new Date().toDateString())
    .reduce((s,a) => s + (a.valor||0), 0);

  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const barData = meses.map((m,i) => ({ label:m, val:[1200,1800,2200,1600,2900,3100,2800,3400,3200,2700,2100,3500][i] }));
  const maxBar = Math.max(...barData.map(b => b.val));

  return (
    <div className="fade-in">
      <div className="stats-grid">
        <div className="stat-card indigo"><div className="stat-icon">📅</div><div className="stat-val">{fmtDinheiro(todayTotal)}</div><div className="stat-label-text">Faturamento Hoje</div></div>
        <div className="stat-card teal"><div className="stat-icon">🗓️</div><div className="stat-val">{fmtDinheiro(totalGeral)}</div><div className="stat-label-text">Total Faturado</div></div>
        <div className="stat-card amber"><div className="stat-icon">🏆</div><div className="stat-val">{concluidos.length}</div><div className="stat-label-text">Atendimentos Concluídos</div></div>
        <div className="stat-card green"><div className="stat-icon">📋</div><div className="stat-val">{agendamentos.length}</div><div className="stat-label-text">Total de Agendamentos</div></div>
      </div>
      <div className="chart-wrap" style={{ marginBottom:20 }}>
        <div><div className="chart-title">📈 Faturamento Anual</div><div className="chart-subtitle">Receita mensal consolidada</div></div>
        <div className="bar-chart" style={{ height:200 }}>
          {barData.map(b => (
            <div className="bar-item" key={b.label}>
              <div style={{ color:'var(--text-muted)',fontSize:'0.7rem',marginBottom:4 }}>{(b.val/1000).toFixed(1)}k</div>
              <div className="bar bar-primary" style={{ height:`${(b.val/maxBar)*150}px` }} />
              <span className="bar-label">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="admin-table-wrap">
        <div className="admin-table-header"><span className="admin-table-title">💰 Atendimentos Concluídos</span></div>
        <table>
          <thead><tr><th>Data / Hora</th><th>Cliente</th><th>Pet</th><th>Serviço</th><th>Valor</th></tr></thead>
          <tbody>
            {concluidos.length === 0 && <tr><td colSpan={5} style={{ textAlign:'center',padding:30,color:'var(--text-muted)' }}>Nenhum atendimento concluído ainda</td></tr>}
            {concluidos.map(a => (
              <tr key={a.id}>
                <td style={{ color:'var(--text-muted)',fontSize:'0.85rem' }}>{fmtData(a.data_hora)} {fmtHora(a.data_hora)}</td>
                <td style={{ fontWeight:500 }}>{a.nome_tutor || a.cliente_nome}</td>
                <td>{a.nome_pet}</td>
                <td>{a.servico_nome}</td>
                <td style={{ color:'var(--success)',fontWeight:700 }}>{fmtDinheiro(a.valor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========================= ADMIN PANEL PRINCIPAL ========================= */
export default function AdminPanel({ user, onLogout }) {
  const [activeNav, setActiveNav]     = useState('dashboard');
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [erro, setErro]                 = useState(null);

  const titles = { dashboard:'Dashboard', agenda:'Agenda', clientes:'Clientes', servicos:'Serviços', financeiro:'Controle Financeiro' };
  const initials = user.nome.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase();

  // Buscar dados reais do servidor
  const fetchDados = useCallback(async () => {
    try {
      setErro(null);
      const [agRes, svRes] = await Promise.all([
        axios.get(`${API}/agendamentos`),
        axios.get(`${API}/servicos`),
      ]);
      setAgendamentos(agRes.data);
      setServicos(svRes.data);
    } catch (e) {
      setErro('⚠️ Servidor não encontrado. Certifique-se que o servidor está rodando na porta 3000.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDados(); }, [fetchDados]);

  // Atualizar status e sincronizar com o servidor
  const handleStatusChange = async (id, novoStatus) => {
    try {
      await axios.patch(`${API}/agendamentos/${id}/status`, { status: novoStatus });
      setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status: novoStatus } : a));
    } catch { alert('Erro ao atualizar status.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir este agendamento?')) return;
    try {
      await axios.delete(`${API}/agendamentos/${id}`);
      setAgendamentos(prev => prev.filter(a => a.id !== id));
    } catch { alert('Erro ao excluir.'); }
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">Pet<span>Care</span></div>
          <div className="sidebar-subtitle">Painel Administrativo</div>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Menu Principal</div>
          {NAV_ITEMS.map(item => (
            <div key={item.id} className={`sidebar-item ${activeNav===item.id?'active':''}`} onClick={() => setActiveNav(item.id)}>
              <span className="sidebar-item-icon">{item.icon}</span>{item.label}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div>
              <div className="sidebar-user-name">{user.nome}</div>
              <div className="sidebar-user-role">Administrador</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ width:'100%',marginTop:8,justifyContent:'center' }} onClick={onLogout}>🚪 Sair</button>
          <button className="btn btn-outline btn-sm" style={{ width:'100%',marginTop:6,justifyContent:'center' }} onClick={fetchDados}>🔄 Atualizar</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div className="topbar-title">{titles[activeNav]}</div>
          <div className="topbar-right">
            <span className="topbar-date">{new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</span>
          </div>
        </div>
        <div className="admin-content">
          {loading && <div style={{ textAlign:'center',padding:60,color:'var(--text-muted)',fontSize:'1.1rem' }}>🔄 Carregando dados...</div>}
          {erro    && <div style={{ background:'#fff3cd',border:'1px solid #ffc107',borderRadius:8,padding:20,margin:20,color:'#856404' }}>{erro}</div>}
          {!loading && !erro && (
            <>
              {activeNav==='dashboard'  && <Dashboard  agendamentos={agendamentos} servicos={servicos} />}
              {activeNav==='agenda'     && <Agenda     agendamentos={agendamentos} onStatusChange={handleStatusChange} onDelete={handleDelete} />}
              {activeNav==='clientes'   && <Clientes />}
              {activeNav==='servicos'   && <Servicos   servicos={servicos} />}
              {activeNav==='financeiro' && <Financeiro agendamentos={agendamentos} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
