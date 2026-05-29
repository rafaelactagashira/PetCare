use serde::{Deserialize, Serialize};
use chrono::NaiveDateTime;

#[derive(Debug, Serialize, Deserialize)]
pub struct Cliente {
    pub id: i64,
    pub nome: String,
    pub telefone_principal: String,
    pub telefone_emergencia: Option<String>,
    pub endereco_cliente: Option<String>,
    pub endereco_pet: Option<String>,
    pub observacoes: Option<String>,
    pub criado_em: Option<NaiveDateTime>,
}

#[derive(Debug, Deserialize)]
pub struct CreateCliente {
    pub nome: String,
    pub telefone_principal: String,
    pub telefone_emergencia: Option<String>,
    pub endereco_cliente: Option<String>,
    pub endereco_pet: Option<String>,
    pub observacoes: Option<String>,
}
