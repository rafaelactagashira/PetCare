import React, { useState } from 'react';

const STEPS = ['Serviço', 'Data & Hora', 'Seus Dados', 'Pet', 'Confirmar'];

const TIME_SLOTS = ['08:00','08:45','09:30','10:15','11:00','11:45','13:00','13:45','14:30','15:15','16:00','16:45','17:30'];

function getNext7Days() {
  const days = [];
  const ptWeekday = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const ptMonth   = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      date: d,
      dayName: ptWeekday[d.getDay()],
      dayNum: d.getDate(),
      month: ptMonth[d.getMonth()],
      disabled: d.getDay() === 0 // Dom fechado
    });
  }
  return days;
}

export default function AgendamentoModal({ onClose, services }) {
  const [step, setStep]       = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate]       = useState(null);
  const [selectedTime, setSelectedTime]       = useState(null);
  const [vanPet, setVanPet]   = useState(false);
  const [done, setDone]       = useState(false);
  const [form, setForm]       = useState({
    nome:'', telefone:'', telefoneEmergencia:'', endereco:'', observacoes:'',
  });
  const [pet, setPet] = useState({
    nome:'', especie:'', raca:'', porte:'', idade:'', peso:'', tipoTosa:'', obs:''
  });

  const days = getNext7Days();

  const handleFieldChange = (setter) => (e) => setter(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const phoneFormat = (v) => {
    v = v.replace(/\D/g,'');
    if(v.length <= 10) return v.replace(/(\d{2})(\d{4})(\d{0,4})/,'($1) $2-$3');
    return v.replace(/(\d{2})(\d{5})(\d{0,4})/,'($1) $2-$3');
  };

  const handlePhone = (name, val) => {
    setForm(f => ({ ...f, [name]: phoneFormat(val) }));
  };

  const canNext = () => {
    if (step === 0) return !!selectedService;
    if (step === 1) return !!selectedDate && !!selectedTime;
    if (step === 2) return form.nome.length > 2 && form.telefone.length > 13;
    if (step === 3) return pet.nome.length > 1 && pet.especie;
    return true;
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Quero usar a Van Pet para meu agendamento.', '_blank');
  };

  const confirmAgendamento = () => {
    setDone(true);
  };

  if (done) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-wrap" onClick={e => e.stopPropagation()} style={{ textAlign:'center', padding:'60px 40px' }}>
          <div style={{ fontSize:'5rem', marginBottom:24 }}>🎉</div>
          <h2 style={{ fontSize:'1.8rem', marginBottom:16 }}>Agendamento Confirmado!</h2>
          <p style={{ color:'var(--text-secondary)', marginBottom:8 }}>
            <strong>{form.nome}</strong>, recebemos o pedido de agendamento para <strong>{pet.nome}</strong>.
          </p>
          <p style={{ color:'var(--text-secondary)', marginBottom:32 }}>
            Serviço: {selectedService?.name} • {selectedDate?.dayName} {selectedDate?.dayNum} às {selectedTime}
          </p>
          <div className="badge badge-success" style={{ margin:'0 auto 32px', fontSize:'1rem', padding:'10px 20px' }}>
            ✅ Agendamento enviado para aprovação
          </div>
          <button className="btn btn-primary btn-lg" style={{ width:'100%' }} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-wrap" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">📅 Novo Agendamento</div>
            <div style={{ color:'var(--text-muted)', fontSize:'0.8rem', marginTop:4 }}>
              Etapa {step + 1} de {STEPS.length}: {STEPS[step]}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Stepper */}
          <div className="stepper">
            {STEPS.map((s, i) => (
              <React.Fragment key={i}>
                <div className="step-item">
                  <div className={`step-circle ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`step-label ${i === step ? 'active' : ''}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* Step 0: Serviço */}
          {step === 0 && (
            <div className="schedule-grid-wrap fade-in">
              <h4 style={{ marginBottom:16, color:'var(--text-secondary)' }}>Escolha o serviço:</h4>
              {services.map(srv => (
                <div
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  style={{
                    display:'flex', alignItems:'center', gap:16, padding:'16px 20px',
                    background: selectedService?.id === srv.id ? 'var(--primary-light)' : 'var(--bg-secondary)',
                    border: `1px solid ${selectedService?.id === srv.id ? 'rgba(108,99,255,0.4)' : 'var(--border-strong)'}`,
                    borderRadius:'var(--radius)', cursor:'pointer', transition:'var(--transition)', marginBottom:10
                  }}
                >
                  <span style={{ fontSize:'2rem' }}>{srv.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600 }}>{srv.name}</div>
                    <div style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{srv.desc}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ color:'var(--primary)', fontWeight:700 }}>{srv.price}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{srv.duration}</div>
                  </div>
                </div>
              ))}
              
              {/* Van Pet toggle */}
              <div className={`vanpet-toggle ${vanPet ? 'active' : ''}`} onClick={() => setVanPet(!vanPet)} style={{ marginTop:8 }}>
                <span className="toggle-icon">🚐</span>
                <div className="toggle-text">
                  <h5>Van Pet (Busca & Entrega)</h5>
                  <p>Valores e disponibilidade combinados via WhatsApp</p>
                </div>
                <div className={`toggle-check ${vanPet ? 'active' : ''}`}>
                  {vanPet && <span style={{ color:'#fff', fontSize:'0.75rem' }}>✓</span>}
                </div>
              </div>
              {vanPet && (
                <button className="btn btn-outline" style={{ width:'100%', marginTop:12 }} onClick={openWhatsApp}>
                  💬 Combinar Van Pet via WhatsApp
                </button>
              )}
            </div>
          )}

          {/* Step 1: Data e Hora */}
          {step === 1 && (
            <div className="schedule-grid-wrap fade-in">
              <div>
                <h4 style={{ marginBottom:12, color:'var(--text-secondary)' }}>Escolha a data:</h4>
                <div className="date-picker-row">
                  {days.map((d, i) => (
                    <button
                      key={i}
                      className={`date-btn ${selectedDate?.dayNum === d.dayNum ? 'selected' : ''} ${d.disabled ? 'busy' : ''}`}
                      onClick={() => !d.disabled && setSelectedDate(d)}
                      disabled={d.disabled}
                    >
                      <span className="day-name">{d.dayName}</span>
                      <span className="day-num">{d.dayNum}</span>
                      <span className="day-month">{d.month}</span>
                    </button>
                  ))}
                </div>
              </div>
              {selectedDate && (
                <div>
                  <h4 style={{ marginBottom:12, color:'var(--text-secondary)' }}>Escolha o horário:</h4>
                  <div className="time-grid">
                    {TIME_SLOTS.map(t => (
                      <button key={t} className={`time-btn ${selectedTime === t ? 'selected' : ''}`} onClick={() => setSelectedTime(t)}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Dados do dono */}
          {step === 2 && (
            <div className="fade-in">
              <h4 style={{ marginBottom:20, color:'var(--text-secondary)' }}>Seus dados:</h4>
              <div className="form-grid">
                <div className="form-group form-grid-full">
                  <label className="form-label">Nome completo *</label>
                  <input name="nome" value={form.nome} onChange={handleFieldChange(setForm)} className="form-control" placeholder="Seu nome completo" />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefone principal *</label>
                  <input name="telefone" value={form.telefone}
                    onChange={e => handlePhone('telefone', e.target.value)}
                    className="form-control" placeholder="(11) 99999-9999" maxLength={15} />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefone de emergência</label>
                  <input name="telefoneEmergencia" value={form.telefoneEmergencia}
                    onChange={e => handlePhone('telefoneEmergencia', e.target.value)}
                    className="form-control" placeholder="(11) 99999-9999" maxLength={15} />
                </div>
                <div className="form-group form-grid-full">
                  <label className="form-label">Endereço</label>
                  <input name="endereco" value={form.endereco} onChange={handleFieldChange(setForm)} className="form-control" placeholder="Rua, número, bairro, cidade" />
                </div>
                <div className="form-group form-grid-full">
                  <label className="form-label">Observações adicionais</label>
                  <textarea name="observacoes" value={form.observacoes} onChange={handleFieldChange(setForm)} className="form-control" rows={3} placeholder="Alguma informação importante..." style={{ resize:'vertical' }} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Dados do pet */}
          {step === 3 && (
            <div className="fade-in">
              <h4 style={{ marginBottom:20, color:'var(--text-secondary)' }}>Dados do seu pet:</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nome do pet *</label>
                  <input name="nome" value={pet.nome} onChange={handleFieldChange(setPet)} className="form-control" placeholder="Ex: Rex" />
                </div>
                <div className="form-group">
                  <label className="form-label">Espécie *</label>
                  <select name="especie" value={pet.especie} onChange={handleFieldChange(setPet)} className="form-control">
                    <option value="">Selecione...</option>
                    <option value="cachorro">🐶 Cachorro</option>
                    <option value="gato">🐱 Gato</option>
                    <option value="outro">🐾 Outro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Raça</label>
                  <input name="raca" value={pet.raca} onChange={handleFieldChange(setPet)} className="form-control" placeholder="Ex: Golden Retriever" />
                </div>
                <div className="form-group">
                  <label className="form-label">Porte</label>
                  <select name="porte" value={pet.porte} onChange={handleFieldChange(setPet)} className="form-control">
                    <option value="">Selecione...</option>
                    <option value="pequeno">Pequeno (até 10kg)</option>
                    <option value="medio">Médio (10-25kg)</option>
                    <option value="grande">Grande (acima de 25kg)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Idade</label>
                  <input name="idade" value={pet.idade} onChange={handleFieldChange(setPet)} className="form-control" placeholder="Ex: 3 anos" />
                </div>
                <div className="form-group">
                  <label className="form-label">Peso (kg)</label>
                  <input name="peso" type="number" value={pet.peso} onChange={handleFieldChange(setPet)} className="form-control" placeholder="Ex: 8" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo de Tosa</label>
                  <select name="tipoTosa" value={pet.tipoTosa} onChange={handleFieldChange(setPet)} className="form-control">
                    <option value="">Selecione...</option>
                    <option>Tosa na Raça</option>
                    <option>Tosa Baixa</option>
                    <option>Tosa Média</option>
                    <option>Tosa Higiênica</option>
                    <option>Sem Tosa</option>
                  </select>
                </div>
                <div className="form-group form-grid-full">
                  <label className="form-label">Comportamento / Observações especiais</label>
                  <textarea name="obs" value={pet.obs} onChange={handleFieldChange(setPet)} className="form-control" rows={3} placeholder="Ex: meu pet é tímido, tem medo de barulho..." style={{ resize:'vertical' }} />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmação */}
          {step === 4 && (
            <div className="fade-in">
              <h4 style={{ marginBottom:20, color:'var(--text-secondary)' }}>Confirme seu agendamento:</h4>
              <div className="summary-grid">
                <div className="summary-row">
                  <span className="summary-label">👤 Nome do dono</span>
                  <span className="summary-value">{form.nome}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">📞 Telefone</span>
                  <span className="summary-value">{form.telefone}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">🐾 Pet</span>
                  <span className="summary-value">{pet.nome} ({pet.especie})</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">✂️ Serviço</span>
                  <span className="summary-value">{selectedService?.name}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">📅 Data</span>
                  <span className="summary-value">{selectedDate?.dayName}, {selectedDate?.dayNum} de {selectedDate?.month}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">⏰ Horário</span>
                  <span className="summary-value">{selectedTime}</span>
                </div>
                {vanPet && (
                  <div className="summary-row">
                    <span className="summary-label">🚐 Van Pet</span>
                    <span className="summary-value badge badge-success">Solicitado</span>
                  </div>
                )}
              </div>
              <div className="summary-total" style={{ marginTop:16 }}>
                <span className="summary-total-label">💰 Valor do Serviço</span>
                <span className="summary-total-value">{selectedService?.price}</span>
              </div>
              <p style={{ color:'var(--text-muted)', fontSize:'0.8rem', marginTop:16, textAlign:'center' }}>
                * O pagamento é realizado presencialmente na loja. O agendamento está sujeito à aprovação.
              </p>
            </div>
          )}

          {/* Footer buttons */}
          <div className="modal-footer">
            <button
              className="btn btn-ghost"
              onClick={() => step === 0 ? onClose() : setStep(s => s - 1)}
            >
              {step === 0 ? '✕ Fechar' : '← Voltar'}
            </button>
            {step < STEPS.length - 1 ? (
              <button
                className="btn btn-primary"
                disabled={!canNext()}
                onClick={() => setStep(s => s + 1)}
                style={{ opacity: canNext() ? 1 : 0.5, cursor: canNext() ? 'pointer' : 'not-allowed' }}
              >
                Próximo →
              </button>
            ) : (
              <button className="btn btn-primary" onClick={confirmAgendamento}>
                ✅ Confirmar Agendamento
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
