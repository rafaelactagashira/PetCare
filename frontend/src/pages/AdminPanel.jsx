import React, { useState } from 'react';

/* ============================================================
   DATA MOCK — simula o banco de dados para demonstração
   ============================================================ */
const hoje = new Date();
const fmt = (d, h) => { const x = new Date(d); x.setHours(h, 0, 0); return x; };

const MOCK_AGENDAMENTOS_INIT = [
  { id:1, clienteNome:'Maria Silva',    petNome:'Bolinha', petEspecie:'cachorro', servico:'Banho e Tosa',       dataHora: fmt(hoje,9),  valor:80,  status:'aprovado',  vanPet:false },
  { id:2, clienteNome:'João Pereira',   petNome:'Mimi',    petEspecie:'gato',     servico:'Banho',              dataHora: fmt(hoje,10), valor:40,  status:'pendente',  vanPet:false },
  { id:3, clienteNome:'Ana Costa',      petNome:'Thor',    petEspecie:'cachorro', servico:'Banho + Tosa Hig.', dataHora: fmt(hoje,11), valor:60,  status:'concluido', vanPet:true  },
  { id:4, clienteNome:'Carlos Mendes',  petNome:'Lilica',  petEspecie:'cachorro', servico:'Hidratação',         dataHora: fmt(hoje,14), valor:30,  status:'pendente',  vanPet:false },
  { id:5, clienteNome:'Fernanda Lima',  petNome:'Max',     petEspecie:'cachorro', servico:'Banho e Tosa',       dataHora: fmt(hoje,15), valor:80,  status:'aprovado',  vanPet:false },
  { id:6, clienteNome:'Roberto Santos', petNome:'Luna',    petEspecie:'gato',     servico:'Escovação Dente',    dataHora: fmt(hoje,16), valor:15,  status:'concluido', vanPet:false },
];

const MOCK_SERVICOS_INIT = [
  { id:1, nome:'Banho e Tosa',        descricao:'Banho + tosa raça/degrade', valor:80, duracao:90, ativo:true  },
  { id:2, nome:'Banho + Tosa Hig.',   descricao:'Banho + aparo higiênico',   valor:60, duracao:75, ativo:true  },
  { id:3, nome:'Banho',               descricao:'Banho completo e secagem',   valor:40, duracao:60, ativo:true  },
  { id:4, nome:'Hidratação Pelagem',  descricao:'Hidratação intensiva',       valor:30, duracao:45, ativo:true  },
  { id:5, nome:'Escovação Dente',     descricao:'Higiene bucal para pets',    valor:15, duracao:20, ativo:false },
];

const MOCK_CLIENTES = [
  { id:1, nome:'Maria Silva',    tel:'(11)99111-2233', pets:1, ultAtend:'Hoje' },
  { id:2, nome:'João Pereira',   tel:'(11)98222-4455', pets:2, ultAtend:'Hoje' },
  { id:3, nome:'Ana Costa',      tel:'(11)97333-6677', pets:1, ultAtend:'Hoje' },
  { id:4, nome:'Carlos Mendes',  tel:'(11)96444-8899', pets:3, ultAtend:'Ontem' },
  { id:5, nome:'Fernanda Lima',  tel:'(11)95555-0011', pets:1, ultAtend:'Hoje' },
  { id:6, nome:'Roberto Santos', tel:'(11)94666-2233', pets:2, ultAtend:'Hoje' },
];

const NAV_ITEMS = [
  { id:'dashboard',  icon:'📊', label:'Dashboard' },
  { id:'agenda',     icon:'📅', label:'Agenda' },
  { id:'clientes',   icon:'👥', label:'Clientes' },
  { id:'servicos',   icon:'✂️',  label:'Serviços' },
  { id:'financeiro', icon:'💰', label:'Financeiro' },
];

function StatusBadge({ status }) {
  const map = { pendente:'warning', aprovado:'primary', concluido:'success', cancelado:'danger' };
  const labels = { pendente:'Pendente', aprovado:'Aprovado', concluido:'Concluído', cancelado:'Cancelado' };
  return <span className={`badge badge-${map[status] || 'primary'}`}>{labels[status] || status}</span>;
}

function fmtHora(d) {
  return d.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
}

function fmtDinheiro(v) {
  return v.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
}

/* ========================= DASHBOARD ========================= */
function Dashboard({ agendamentos, servicos }) {
  const today = agendamentos.filter(a => {
    const d = new Date(a.dataHora); const n = new Date();
    return d.toDateString() === n.toDateString();
  });
  const concluidos = agendamentos.filter(a => a.status === 'concluido');
  const pendentes  = agendamentos.filter(a => a.status === 'pendente');
  const totalDia   = today.filter(a => a.status === 'concluido').reduce((s,a) => s + a.valor, 0);
  const totalMes   = concluidos.reduce((s,a) => s + a.valor, 0);

  const barData = ['Seg','Ter','Qua','Qui','Sex','Sáb'].map((l, i) => ({
    label: l,
    val: [420, 680, 390, 870, 750, 310][i],
    max: 870
  }));

  const topServicos = servicos.map(s => ({
    ...s,
    count: agendamentos.filter(a => a.servico.includes(s.nome.split(' ')[0])).length
  })).sort((a,b) => b.count - a.count).slice(0,5);

  return (
    <div className="fade-in">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card indigo">
          <div className="stat-icon">📅</div>
          <div className="stat-val">{today.length}</div>
          <div className="stat-label-text">Agendamentos Hoje</div>
          <div className="stat-change up">↑ +2 vs ontem</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-icon">✅</div>
          <div className="stat-val">{concluidos.length}</div>
          <div className="stat-label-text">Concluídos</div>
          <div className="stat-change up">↑ Taxa 83%</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon">⏳</div>
          <div className="stat-val">{pendentes.length}</div>
          <div className="stat-label-text">Pendentes</div>
          <div className="stat-change down">Aguardando aprovação</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">💰</div>
          <div className="stat-val">{fmtDinheiro(totalMes)}</div>
          <div className="stat-label-text">Faturamento (mês)</div>
          <div className="stat-change up">↑ +18% vs mês anterior</div>
        </div>
      </div>

      <div className="admin-grid-2">
        {/* Bar chart */}
        <div className="chart-wrap">
          <div>
            <div className="chart-title">💰 Faturamento Semanal</div>
            <div className="chart-subtitle">Receita por dia da semana</div>
          </div>
          <div className="bar-chart">
            {barData.map(b => (
              <div className="bar-item" key={b.label}>
                <div className="bar bar-primary" style={{ height: `${(b.val/b.max)*130}px` }} />
                <span className="bar-label">{b.label}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', color:'var(--text-muted)', fontSize:'0.85rem' }}>
            Total semana: <strong style={{ color:'var(--text-primary)' }}>R$ 3.420,00</strong>
          </div>
        </div>

        {/* Serviços mais vendidos */}
        <div className="chart-wrap">
          <div>
            <div className="chart-title">🏆 Serviços Mais Realizados</div>
            <div className="chart-subtitle">Ranking do mês</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {topServicos.map((s, i) => (
              <div key={s.id} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{
                  width:28, height:28, borderRadius:'50%', background: i === 0 ? 'var(--warning)' : 'var(--bg-secondary)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:700, flexShrink:0,
                  color: i === 0 ? '#000' : 'var(--text-muted)'
                }}>
                  {i + 1}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:500, fontSize:'0.9rem' }}>{s.nome}</div>
                  <div style={{ height:4, background:'var(--bg-secondary)', borderRadius:2, marginTop:4 }}>
                    <div style={{ height:'100%', background:'var(--primary)', borderRadius:2, width:`${Math.max(10, (s.count / 6) * 100)}%` }} />
                  </div>
                </div>
                <div style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>{s.count}x</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Próximos agendamentos */}
      <div className="admin-table-wrap" style={{ marginTop:20 }}>
        <div className="admin-table-header">
          <span className="admin-table-title">📅 Próximos Agendamentos Hoje</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Cliente / Pet</th>
              <th>Serviço</th>
              <th>Horário</th>
              <th>Status</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {today.map(a => (
              <tr key={a.id}>
                <td>
                  <div style={{ fontWeight:500 }}>{a.clienteNome}</div>
                  <div style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{a.petNome} ({a.petEspecie})</div>
                </td>
                <td>{a.servico}{a.vanPet ? ' 🚐' : ''}</td>
                <td>{fmtHora(new Date(a.dataHora))}</td>
                <td><StatusBadge status={a.status} /></td>
                <td style={{ color:'var(--primary)', fontWeight:600 }}>{fmtDinheiro(a.valor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========================= AGENDA ========================= */
function Agenda({ agendamentos, setAgendamentos }) {
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const filtered = agendamentos.filter(a => {
    const d = new Date(a.dataHora);
    return d.toISOString().split('T')[0] === filterDate;
  });

  const changeStatus = (id, newStatus) => {
    setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="fade-in">
      <div className="filters-bar">
        <input
          type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
          className="form-control" style={{ maxWidth:200 }}
        />
        <span style={{ color:'var(--text-muted)', fontSize:'0.9rem' }}>
          {filtered.length} agendamento(s)
        </span>
      </div>
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-title">📅 Agenda — {new Date(filterDate + 'T12:00:00').toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long' })}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Horário</th>
              <th>Cliente / Pet</th>
              <th>Serviço</th>
              <th>Van Pet</th>
              <th>Status</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>
                Nenhum agendamento nesta data
              </td></tr>
            )}
            {filtered.map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight:600, color:'var(--primary)' }}>{fmtHora(new Date(a.dataHora))}</td>
                <td>
                  <div style={{ fontWeight:500 }}>{a.clienteNome}</div>
                  <div style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{a.petNome} ({a.petEspecie})</div>
                </td>
                <td>{a.servico}</td>
                <td>{a.vanPet ? <span className="badge badge-success">🚐 Sim</span> : '—'}</td>
                <td><StatusBadge status={a.status} /></td>
                <td style={{ color:'var(--primary)', fontWeight:600 }}>{fmtDinheiro(a.valor)}</td>
                <td>
                  <div className="td-actions">
                    {a.status === 'pendente' && (
                      <button className="btn btn-success btn-sm" onClick={() => changeStatus(a.id,'aprovado')}>✅ Aprovar</button>
                    )}
                    {a.status === 'aprovado' && (
                      <button className="btn btn-primary btn-sm" onClick={() => changeStatus(a.id,'concluido')}>🏁 Concluir</button>
                    )}
                    {a.status !== 'cancelado' && a.status !== 'concluido' && (
                      <button className="btn btn-danger btn-sm" onClick={() => changeStatus(a.id,'cancelado')}>✕</button>
                    )}
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
  const [search, setSearch] = useState('');
  const filtered = MOCK_CLIENTES.filter(c => c.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fade-in">
      <div className="filters-bar">
        <div className="search-input-wrap" style={{ flex:1, maxWidth:360 }}>
          <span className="search-icon">🔍</span>
          <input className="form-control" placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-title">👥 Clientes Cadastrados ({filtered.length})</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Pets</th>
              <th>Último atend.</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{
                      width:36, height:36, borderRadius:'50%', background:'var(--primary-light)',
                      display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'var(--primary)', fontSize:'0.85rem'
                    }}>
                      {c.nome.charAt(0)}
                    </div>
                    <span style={{ fontWeight:500 }}>{c.nome}</span>
                  </div>
                </td>
                <td>{c.tel}</td>
                <td>{c.pets} pet{c.pets > 1 ? 's' : ''}</td>
                <td>{c.ultAtend}</td>
                <td>
                  <button className="btn btn-outline btn-sm">Ver detalhes</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========================= SERVIÇOS ========================= */
function Servicos({ servicos, setServicos }) {
  const [editing, setEditing]   = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome:'', descricao:'', valor:'', duracao:'', ativo:true });

  const toggleAtivo = (id) => setServicos(prev => prev.map(s => s.id === id ? { ...s, ativo: !s.ativo } : s));

  const saveEditing = () => {
    setServicos(prev => prev.map(s => s.id === editing.id ? { ...s, ...form, valor: parseFloat(form.valor), duracao: parseInt(form.duracao) } : s));
    setEditing(null);
  };

  const addNew = () => {
    const newS = { ...form, id: Date.now(), valor: parseFloat(form.valor), duracao: parseInt(form.duracao) };
    setServicos(prev => [...prev, newS]);
    setShowForm(false);
    setForm({ nome:'', descricao:'', valor:'', duracao:'', ativo:true });
  };

  return (
    <div className="fade-in">
      <div className="filters-bar">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Fechar' : '+ Novo Serviço'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom:20 }}>
          <h4 style={{ marginBottom:20 }}>Novo Serviço</h4>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nome *</label>
              <input className="form-control" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome do serviço" />
            </div>
            <div className="form-group">
              <label className="form-label">Valor (R$) *</label>
              <input type="number" className="form-control" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} placeholder="0.00" />
            </div>
            <div className="form-group form-grid-full">
              <label className="form-label">Descrição</label>
              <input className="form-control" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Descrição breve" />
            </div>
            <div className="form-group">
              <label className="form-label">Duração (min) *</label>
              <input type="number" className="form-control" value={form.duracao} onChange={e => setForm(f => ({ ...f, duracao: e.target.value }))} placeholder="60" />
            </div>
          </div>
          <div style={{ display:'flex', gap:12, marginTop:20 }}>
            <button className="btn btn-primary" onClick={addNew} disabled={!form.nome || !form.valor || !form.duracao}>
              ✅ Salvar Serviço
            </button>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-title">✂️ Serviços Cadastrados</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Serviço</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Duração</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {servicos.map(s => (
              <tr key={s.id}>
                {editing?.id === s.id ? (
                  <>
                    <td><input className="form-control" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} /></td>
                    <td><input className="form-control" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} /></td>
                    <td><input type="number" className="form-control" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} style={{ width:90 }} /></td>
                    <td><input type="number" className="form-control" value={form.duracao} onChange={e => setForm(f => ({ ...f, duracao: e.target.value }))} style={{ width:80 }} /></td>
                    <td>—</td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn-success btn-sm" onClick={saveEditing}>Salvar</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>✕</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ fontWeight:500 }}>{s.nome}</td>
                    <td style={{ color:'var(--text-secondary)', fontSize:'0.85rem' }}>{s.descricao}</td>
                    <td style={{ color:'var(--primary)', fontWeight:600 }}>{fmtDinheiro(s.valor)}</td>
                    <td style={{ color:'var(--text-muted)' }}>{s.duracao} min</td>
                    <td>
                      <button
                        className={`badge ${s.ativo ? 'badge-success' : 'badge-danger'}`}
                        style={{ cursor:'pointer', border:'none' }}
                        onClick={() => toggleAtivo(s.id)}
                      >
                        {s.ativo ? '● Ativo' : '○ Inativo'}
                      </button>
                    </td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn-outline btn-sm" onClick={() => { setEditing(s); setForm({ nome:s.nome, descricao:s.descricao||'', valor:s.valor, duracao:s.duracao, ativo:s.ativo }); }}>
                          ✏️ Editar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => setServicos(prev => prev.filter(x => x.id !== s.id))}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </>
                )}
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
  const totalGeral = concluidos.reduce((s,a) => s + a.valor, 0);
  const todayTotal = concluidos.filter(a => new Date(a.dataHora).toDateString() === new Date().toDateString()).reduce((s,a) => s + a.valor, 0);

  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const barData = meses.map((m,i) => ({ label: m, val: [1200,1800,2200,1600,2900,3100,2800,3400,3200,2700,2100,3500][i] }));
  const maxBar = Math.max(...barData.map(b => b.val));

  return (
    <div className="fade-in">
      <div className="stats-grid">
        <div className="stat-card indigo">
          <div className="stat-icon">📅</div>
          <div className="stat-val">{fmtDinheiro(todayTotal)}</div>
          <div className="stat-label-text">Faturamento Hoje</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-icon">📆</div>
          <div className="stat-val">{fmtDinheiro(1420)}</div>
          <div className="stat-label-text">Faturamento Semana</div>
          <div className="stat-change up">↑ +12% vs semana passada</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon">🗓️</div>
          <div className="stat-val">{fmtDinheiro(totalGeral)}</div>
          <div className="stat-label-text">Faturamento Mês</div>
          <div className="stat-change up">↑ +18% vs mês anterior</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">🏆</div>
          <div className="stat-val">{concluidos.length}</div>
          <div className="stat-label-text">Total Atendimentos</div>
        </div>
      </div>

      <div className="chart-wrap" style={{ marginBottom:20 }}>
        <div>
          <div className="chart-title">📈 Faturamento Anual</div>
          <div className="chart-subtitle">Receita mensal consolidada</div>
        </div>
        <div className="bar-chart" style={{ height:200 }}>
          {barData.map(b => (
            <div className="bar-item" key={b.label}>
              <div style={{ color:'var(--text-muted)', fontSize:'0.7rem', marginBottom:4 }}>
                {(b.val/1000).toFixed(1)}k
              </div>
              <div className="bar bar-primary" style={{ height:`${(b.val/maxBar)*150}px` }} />
              <span className="bar-label">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-title">💰 Atendimentos Concluídos</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Data / Hora</th>
              <th>Cliente</th>
              <th>Pet</th>
              <th>Serviço</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {concluidos.map(a => (
              <tr key={a.id}>
                <td style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>
                  {new Date(a.dataHora).toLocaleDateString('pt-BR')} {fmtHora(new Date(a.dataHora))}
                </td>
                <td style={{ fontWeight:500 }}>{a.clienteNome}</td>
                <td>{a.petNome}</td>
                <td>{a.servico}</td>
                <td style={{ color:'var(--success)', fontWeight:700 }}>{fmtDinheiro(a.valor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========================= ADMIN PANEL ========================= */
export default function AdminPanel({ user, onLogout }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [agendamentos, setAgendamentos] = useState(MOCK_AGENDAMENTOS_INIT);
  const [servicos, setServicos]         = useState(MOCK_SERVICOS_INIT);

  const titles = { dashboard:'Dashboard', agenda:'Agenda', clientes:'Clientes', servicos:'Serviços', financeiro:'Controle Financeiro' };

  const initials = user.nome.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase();

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">Pet<span>Care</span></div>
          <div className="sidebar-subtitle">Painel Administrativo</div>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Menu Principal</div>
          {NAV_ITEMS.map(item => (
            <div
              key={item.id}
              className={`sidebar-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              {item.label}
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
          <button className="btn btn-ghost btn-sm" style={{ width:'100%', marginTop:8, justifyContent:'center' }} onClick={onLogout}>
            🚪 Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="topbar-title">{titles[activeNav]}</div>
          <div className="topbar-right">
            <span className="topbar-date">
              {new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long', year:'numeric' })}
            </span>
          </div>
        </div>
        <div className="admin-content">
          {activeNav === 'dashboard'  && <Dashboard   agendamentos={agendamentos} servicos={servicos} />}
          {activeNav === 'agenda'     && <Agenda      agendamentos={agendamentos} setAgendamentos={setAgendamentos} />}
          {activeNav === 'clientes'   && <Clientes />}
          {activeNav === 'servicos'   && <Servicos    servicos={servicos} setServicos={setServicos} />}
          {activeNav === 'financeiro' && <Financeiro  agendamentos={agendamentos} />}
        </div>
      </main>
    </div>
  );
}
