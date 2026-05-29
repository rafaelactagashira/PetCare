use serde::{Deserialize, Serialize};
use chrono::NaiveDateTime;

#[derive(Debug, Serialize, Deserialize)]
pub struct Pet {
    pub id: i64,
    pub cliente_id: i64,
    pub nome: String,
    pub especie: String,
    pub raca: Option<String>,
    pub porte: Option<String>,
    pub idade: Option<i64>,
    pub peso: Option<f64>,
    pub tipo_tosa: Option<String>,
    pub observacoes_comportamento: Option<String>,
    pub criado_em: Option<NaiveDateTime>,
}

#[derive(Debug, Deserialize)]
pub struct CreatePet {
    pub cliente_id: i64,
    pub nome: String,
    pub especie: String,
    pub raca: Option<String>,
    pub porte: Option<String>,
    pub idade: Option<i64>,
    pub peso: Option<f64>,
    pub tipo_tosa: Option<String>,
    pub observacoes_comportamento: Option<String>,
}
