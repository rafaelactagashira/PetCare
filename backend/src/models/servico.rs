use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Servico {
    pub id: i64,
    pub nome: String,
    pub descricao: Option<String>,
    pub valor: f64,
    pub duracao_minutos: i64,
    pub ativo: bool,
}

#[derive(Debug, Deserialize)]
pub struct CreateServico {
    pub nome: String,
    pub descricao: Option<String>,
    pub valor: f64,
    pub duracao_minutos: i64,
    pub ativo: Option<bool>,
}
