import React, { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [email, setEmail]   = useState('');
  const [senha, setSenha]   = useState('');
  const [erro, setErro]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (email === 'admin@petcare.com' && senha === 'admin123') {
      onLogin({ nome: 'Administrador', email });
    } else {
      setErro('E-mail ou senha inválidos.');
    }
    setLoading(false);
  };

  return (
    <div className="login-wrap">
      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>
      <div className="login-card fade-in">
        <div className="login-logo">
          <h1>Pet<span>Care</span></h1>
          <p>Área Administrativa</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="form-control" placeholder="admin@petcare.com" required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password" value={senha} onChange={e => setSenha(e.target.value)}
              className="form-control" placeholder="••••••••" required
            />
          </div>
          {erro && (
            <div style={{ background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.2)', color:'var(--danger)', padding:'10px 14px', borderRadius:'var(--radius-sm)', fontSize:'0.85rem' }}>
              ⚠️ {erro}
            </div>
          )}
          <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
            {loading ? '⏳ Entrando...' : '🔐 Entrar'}
          </button>
        </form>
        <div className="login-footer">
          <span style={{ fontSize:'0.75rem' }}>Credenciais demo: admin@petcare.com / admin123</span>
        </div>
      </div>
    </div>
  );
}
