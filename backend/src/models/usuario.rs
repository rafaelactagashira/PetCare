use serde::{Deserialize, Serialize};
use chrono::NaiveDateTime;

#[derive(Debug, Serialize, Deserialize)]
pub struct Usuario {
    pub id: i64,
    pub nome: String,
    pub email: String,
    #[serde(skip_serializing)]
    pub senha_hash: String,
    pub criado_em: Option<NaiveDateTime>,
}

#[derive(Debug, Deserialize)]
pub struct CreateUsuario {
    pub nome: String,
    pub email: String,
    pub senha_hash: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginUsuario {
    pub email: String,
    pub senha: String,
}
