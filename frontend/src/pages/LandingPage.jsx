import React, { useState, useEffect } from 'react';
import AgendamentoModal from '../components/AgendamentoModal';
import axios from 'axios';

const API = 'http://localhost:3000/api';

const EMOJIS = ['✂️', '🛁', '🫧', '💧', '🦷'];

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const DIFERENCIAIS = [
  { icon:'🏆', title:'Profissionais Certificados', desc:'Nossa equipe é treinada e certificada para oferecer o melhor cuidado possível ao seu pet.' },
  { icon:'💖', title:'Amor e Carinho', desc:'Tratamos cada animal como se fosse da nossa família. Seu pet vai adorar vir ao PetCare!' },
  { icon:'⏰', title:'Pontualidade Garantida', desc:'Respeitamos o seu tempo. Os agendamentos são organizados para evitar esperas longas.' },
  { icon:'🚐', title:'Van Pet Disponível', desc:'Serviço de busca e entrega do seu pet na sua residência. Combine pelo WhatsApp.' },
  { icon:'🔬', title:'Produtos Premium', desc:'Utilizamos apenas produtos de alta qualidade, seguros e testados dermatologicamente.' },
  { icon:'📱', title:'Agendamento Online', desc:'Agende pelo site em poucos minutos, sem ligações ou mensagens demoradas.' },
];

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  const [services, setServices]   = useState([]);

  useEffect(() => {
    axios.get(`${API}/servicos`).then(r => {
      const mapped = r.data.map((s, i) => ({
        id:       s.id,
        emoji:    EMOJIS[i % EMOJIS.length],
        name:     s.nome,
        desc:     s.descricao,
        price:    `R$ ${Number(s.valor).toFixed(2).replace('.',',')}`,
        duration: `~${s.duracao_minutos} min`,
      }));
      setServices(mapped);
    }).catch(() => {
      // fallback se servidor estiver desligado
      setServices([
        { id:1, emoji:'✂️', name:'Banho e Tosa',          desc:'Banho completo + tosa na raça',    price:'R$ 80,00', duration:'~90 min' },
        { id:2, emoji:'🛁', name:'Banho + Tosa Higiìanica', desc:'Banho com aparo higiênico',          price:'R$ 60,00', duration:'~75 min' },
        { id:3, emoji:'🫧', name:'Banho',                  desc:'Banho completo com secagem',        price:'R$ 40,00', duration:'~60 min' },
        { id:4, emoji:'💧', name:'Hidratação na Pelagem',  desc:'Tratamento intensivo',               price:'R$ 30,00', duration:'~45 min' },
        { id:5, emoji:'🦷', name:'Escovação no Dente',     desc:'Higiene bucal para pets',           price:'R$ 15,00', duration:'~20 min' },
      ]);
    });
  }, []);

  const openWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Quero agendar um serviço na PetCare.', '_blank');
  };

  return (
    <div className="landing-wrap">
      {/* BG Blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Navbar */}
      <nav className="nav glass">
        <div className="nav-logo">Pet<span>Care</span></div>
        <div className="nav-links">
          <a href="#servicos"   onClick={e => { e.preventDefault(); scrollTo('servicos');   }}>Serviços</a>
          <a href="#diferenciais" onClick={e => { e.preventDefault(); scrollTo('diferenciais'); }}>Diferenciais</a>
          <a href="#vanpet"    onClick={e => { e.preventDefault(); scrollTo('vanpet');    }}>Van Pet</a>
          <a href="#contato"   onClick={e => { e.preventDefault(); scrollTo('contato');   }}>Contato</a>
        </div>
        <div className="nav-cta">
          <button className="btn btn-outline btn-sm" onClick={openWhatsApp}>WhatsApp</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>Agendar</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow fade-up delay-1">
            🐾 Petshop Premium em São Paulo
          </div>
          <h1 className="hero-title fade-up delay-2">
            Cuidado e carinho para o seu <span className="highlight">melhor amigo</span>
          </h1>
          <p className="hero-desc fade-up delay-3">
            Agende banho, tosa e tratamentos especiais de forma rápida e prática.
            Profissionais certificados, produtos premium e muito amor pelo seu pet.
          </p>
          <div className="hero-actions fade-up delay-4">
            <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
              📅 Agendar Agora
            </button>
            <button className="btn btn-outline btn-lg" onClick={openWhatsApp}>
              💬 WhatsApp
            </button>
          </div>
          <div className="hero-stats fade-up delay-5">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Pets Atendidos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5⭐</span>
              <span className="stat-label">Avaliação</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">3 anos</span>
              <span className="stat-label">de Experiência</span>
            </div>
          </div>
        </div>

        <div className="hero-visual fade-in delay-3">
          <div className="hero-img-grid">
            <div className="hero-img-main">
              <img src="/dog_bath.png" alt="Cachorro tomando banho" />
            </div>
            <div className="hero-img-side">
              <img src="/dog_grooming.png" alt="Tosa profissional" />
            </div>
            <div className="hero-img-wide">
              <img src="/dog_happy.png" alt="Pet feliz após o banho" />
            </div>
          </div>
          <div className="hero-img-badge">
            <span className="hero-img-badge-icon">⭐</span>
            <div>
              <div className="hero-img-badge-val">+500 pets atendidos</div>
              <div className="hero-img-badge-text">Avaliação 5 estrelas pelos tutores</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicos" className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-eyebrow">Nossos Serviços</span>
            <h2 className="section-title">Tudo que seu pet precisa</h2>
            <p className="section-desc">Oferecemos serviços completos de grooming e cuidados para o seu animal.</p>
          </div>
          <div className="services-grid">
            {services.length === 0 && (
              <div style={{ gridColumn:'1/-1', textAlign:'center', padding:40, color:'var(--text-muted)' }}>Carregando serviços...</div>
            )}
            {services.map(srv => (
              <div className="service-card" key={srv.id} onClick={() => setShowModal(true)}>
                <span className="service-emoji">{srv.emoji}</span>
                <div className="service-name">{srv.name}</div>
                <div className="service-desc">{srv.desc}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'auto' }}>
                  <span className="service-price">{srv.price}</span>
                  <span className="service-duration">{srv.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section id="diferenciais" className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-eyebrow">Por que nos escolher</span>
            <h2 className="section-title">Nossos Diferenciais</h2>
            <p className="section-desc">Mais do que um petshop, somos parceiros na saúde e felicidade do seu pet.</p>
          </div>
          <div className="diferenciais-grid">
            {DIFERENCIAIS.map((d, i) => (
              <div className="diferencial-card" key={i}>
                <div className="diferencial-icon">{d.icon}</div>
                <div className="diferencial-title">{d.title}</div>
                <div className="diferencial-desc">{d.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Van Pet */}
      <section id="vanpet" className="section">
        <div className="section-inner">
          <div className="vanpet-section">
            <div className="vanpet-visual">🚐</div>
            <div className="vanpet-content">
              <span className="badge badge-primary" style={{ marginBottom:20, display:'inline-block' }}>Serviço Exclusivo</span>
              <h2 className="vanpet-title">Van Pet — Busca e Entrega</h2>
              <p className="vanpet-desc">
                Não tem como trazer seu pet? Sem problema! Nosso serviço de Van Pet busca e entrega
                seu animal com segurança e conforto. Disponibilidade e valores combinados diretamente
                pelo WhatsApp.
              </p>
              <button className="btn btn-primary btn-lg" onClick={openWhatsApp}>
                💬 Combinar via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Info / Contato */}
      <section id="contato" className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-eyebrow">Informações</span>
            <h2 className="section-title">Onde nos encontrar</h2>
          </div>
          <div className="info-strip">
            <div className="info-strip-card">
              <div className="info-icon-wrap info-icon-purple">🏠</div>
              <div>
                <div className="info-label">Endereço</div>
                <div className="info-value">Rua dos Animais, 123 — Centro</div>
                <div className="info-label" style={{ marginTop:4 }}>São Paulo, SP</div>
              </div>
            </div>
            <div className="info-strip-card">
              <div className="info-icon-wrap info-icon-teal">⏰</div>
              <div>
                <div className="info-label">Horário de Funcionamento</div>
                <div className="info-value">Segunda a Sábado</div>
                <div className="info-label" style={{ marginTop:4 }}>08:00 às 18:00</div>
              </div>
            </div>
            <div className="info-strip-card">
              <div className="info-icon-wrap info-icon-yellow">📱</div>
              <div>
                <div className="info-label">WhatsApp</div>
                <div className="info-value">(11) 99999-9999</div>
                <div className="info-label" style={{ marginTop:4 }}>Atendimento rápido</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="section-inner">
          <div className="cta-section">
            <span className="badge badge-primary" style={{ marginBottom:20 }}>✨ Faça seu pet feliz hoje</span>
            <h2 className="cta-title">Pronto para agendar?</h2>
            <p className="cta-desc">Escolha o serviço, data e horário em menos de 2 minutos.</p>
            <div className="cta-buttons">
              <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
                📅 Agendar Agora
              </button>
              <button className="btn btn-outline btn-lg" onClick={openWhatsApp}>
                💬 Falar pelo WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">Pet<span>Care</span></div>
        <p className="footer-text">
          © 2026 PetCare — Todos os direitos reservados. Feito com 💜 para os pets.
        </p>
      </footer>

      {/* Modal de Agendamento */}
      {showModal && <AgendamentoModal onClose={() => setShowModal(false)} services={services} />}
    </div>
  );
}
