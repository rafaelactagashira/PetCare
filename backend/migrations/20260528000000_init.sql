-- Tabela Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone_principal TEXT NOT NULL,
    telefone_emergencia TEXT,
    endereco_cliente TEXT,
    endereco_pet TEXT,
    observacoes TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Pets
CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    especie TEXT NOT NULL,
    raca TEXT,
    porte TEXT,
    idade INTEGER,
    peso REAL,
    tipo_tosa TEXT,
    observacoes_comportamento TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- Tabela Servicos
CREATE TABLE IF NOT EXISTS servicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    valor REAL NOT NULL,
    duracao_minutos INTEGER NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT 1
);

-- Tabela Agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    pet_id INTEGER NOT NULL,
    servico_id INTEGER NOT NULL,
    data_hora DATETIME NOT NULL,
    van_pet BOOLEAN NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pendente',
    valor_cobrado REAL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
    FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE
);

-- Tabela Configuracoes
CREATE TABLE IF NOT EXISTS configuracoes (
    chave TEXT PRIMARY KEY,
    valor TEXT NOT NULL
);
