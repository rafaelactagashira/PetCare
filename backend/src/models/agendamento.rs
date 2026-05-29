use serde::{Deserialize, Serialize};
use chrono::NaiveDateTime;

#[derive(Debug, Serialize, Deserialize)]
pub struct Agendamento {
    pub id: i64,
    pub cliente_id: i64,
    pub pet_id: i64,
    pub servico_id: i64,
    pub data_hora: NaiveDateTime,
    pub van_pet: bool,
    pub status: String,
    pub valor_cobrado: Option<f64>,
    pub criado_em: Option<NaiveDateTime>,
}

#[derive(Debug, Deserialize)]
pub struct CreateAgendamento {
    pub cliente_id: i64,
    pub pet_id: i64,
    pub servico_id: i64,
    pub data_hora: NaiveDateTime,
    pub van_pet: Option<bool>,
}
