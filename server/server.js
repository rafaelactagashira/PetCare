const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Arquivo de banco de dados (JSON persistido em disco)
const DB_FILE = path.join(__dirname, 'petcare_data.json');

// Serviços padrão do petshop
const SERVICOS_PADRAO = [
  { id: 1, nome: 'Banho e Tosa',          descricao: 'Banho completo + tosa na raça ou degradê', valor: 80,  duracao_minutos: 90, ativo: true },
  { id: 2, nome: 'Banho + Tosa Higiênica',descricao: 'Banho com escovação e aparo higiênico',    valor: 60,  duracao_minutos: 75, ativo: true },
  { id: 3, nome: 'Banho',                  descricao: 'Banho completo com secagem e perfume',     valor: 40,  duracao_minutos: 60, ativo: true },
  { id: 4, nome: 'Hidratação na Pelagem',  descricao: 'Tratamento intensivo de hidratação',       valor: 30,  duracao_minutos: 45, ativo: true },
  { id: 5, nome: 'Escovação no Dente',     descricao: 'Higiene bucal para pets',                  valor: 15,  duracao_minutos: 20, ativo: true },
];

// Inicializar banco de dados
function carregarBanco() {
  if (!fs.existsSync(DB_FILE)) {
    const dadosIniciais = { agendamentos: [], clientes: [], servicos: SERVICOS_PADRAO, nextId: { agendamento: 1, cliente: 1 } };
    fs.writeFileSync(DB_FILE, JSON.stringify(dadosIniciais, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function salvarBanco(dados) {
  fs.writeFileSync(DB_FILE, JSON.stringify(dados, null, 2));
}

// ============================
// ROTAS DE SERVIÇOS
// ============================
app.get('/api/servicos', (req, res) => {
  const db = carregarBanco();
  res.json(db.servicos.filter(s => s.ativo));
});

// ============================
// ROTAS DE AGENDAMENTOS
// ============================

// Listar todos os agendamentos
app.get('/api/agendamentos', (req, res) => {
  const db = carregarBanco();
  // Enriquecer com nome do serviço
  const agendamentos = db.agendamentos.map(a => {
    const servico = db.servicos.find(s => s.id === a.servico_id);
    const cliente = db.clientes.find(c => c.id === a.cliente_id);
    return {
      ...a,
      servico_nome: servico ? servico.nome : 'Desconhecido',
      servico_valor: servico ? servico.valor : 0,
      cliente_nome: a.nome_tutor || (cliente ? cliente.nome : 'Desconhecido'),
    };
  });
  res.json(agendamentos);
});

// Criar novo agendamento (vindo do modal do site)
app.post('/api/agendamentos', (req, res) => {
  const db = carregarBanco();
  const { servico_id, data_hora, nome_tutor, telefone, nome_pet, especie, porte, raca, observacoes, van_pet } = req.body;

  if (!servico_id || !data_hora || !nome_tutor || !nome_pet) {
    return res.status(400).json({ erro: 'Campos obrigatórios: servico_id, data_hora, nome_tutor, nome_pet' });
  }

  // Criar ou encontrar cliente
  let cliente = db.clientes.find(c => c.telefone === telefone);
  if (!cliente) {
    cliente = { id: db.nextId.cliente++, nome: nome_tutor, telefone, criado_em: new Date().toISOString() };
    db.clientes.push(cliente);
  }

  const servico = db.servicos.find(s => s.id === Number(servico_id));

  const novoAgendamento = {
    id: db.nextId.agendamento++,
    cliente_id: cliente.id,
    servico_id: Number(servico_id),
    data_hora,
    nome_tutor,
    telefone,
    nome_pet,
    especie: especie || 'cachorro',
    porte: porte || '',
    raca: raca || '',
    observacoes: observacoes || '',
    van_pet: van_pet || false,
    status: 'pendente',
    valor: servico ? servico.valor : 0,
    criado_em: new Date().toISOString(),
  };

  db.agendamentos.push(novoAgendamento);
  salvarBanco(db);

  res.status(201).json(novoAgendamento);
});

// Atualizar status do agendamento
app.patch('/api/agendamentos/:id/status', (req, res) => {
  const db = carregarBanco();
  const id = Number(req.params.id);
  const { status } = req.body;

  const idx = db.agendamentos.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ erro: 'Agendamento não encontrado' });

  db.agendamentos[idx].status = status;
  salvarBanco(db);

  res.json(db.agendamentos[idx]);
});

// Deletar agendamento
app.delete('/api/agendamentos/:id', (req, res) => {
  const db = carregarBanco();
  const id = Number(req.params.id);
  db.agendamentos = db.agendamentos.filter(a => a.id !== id);
  salvarBanco(db);
  res.json({ ok: true });
});

// ============================
// ROTAS DE CLIENTES
// ============================
app.get('/api/clientes', (req, res) => {
  const db = carregarBanco();
  const clientes = db.clientes.map(c => ({
    ...c,
    total_agendamentos: db.agendamentos.filter(a => a.cliente_id === c.id).length,
  }));
  res.json(clientes);
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', db: DB_FILE }));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n🐾 Servidor PetCare rodando em http://localhost:${PORT}`);
  console.log(`💾 Banco de dados: ${DB_FILE}`);
  console.log(`\nRotas disponíveis:`);
  console.log(`  GET  /api/servicos`);
  console.log(`  GET  /api/agendamentos`);
  console.log(`  POST /api/agendamentos`);
  console.log(`  PATCH /api/agendamentos/:id/status`);
  console.log(`  GET  /api/clientes\n`);
});
