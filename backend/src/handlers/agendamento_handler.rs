use axum::{
    extract::{State, Path},
    http::StatusCode,
    Json,
};
use sqlx::SqlitePool;
use crate::models::agendamento::{Agendamento, CreateAgendamento};
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct AgendamentoComDetalhes {
    pub id: i64,
    pub cliente_id: i64,
    pub pet_id: i64,
    pub servico_id: i64,
    pub data_hora: chrono::NaiveDateTime,
    pub van_pet: bool,
    pub status: String,
    pub valor_cobrado: Option<f64>,
    pub criado_em: Option<chrono::NaiveDateTime>,
    // Detalhes extras
    pub cliente_nome: String,
    pub pet_nome: String,
    pub servico_nome: String,
}

pub async fn list_agendamentos(
    State(pool): State<SqlitePool>,
) -> Result<Json<Vec<AgendamentoComDetalhes>>, (StatusCode, String)> {
    let agendamentos = sqlx::query_as!(
        AgendamentoComDetalhes,
        r#"
        SELECT 
            a.id, a.cliente_id, a.pet_id, a.servico_id, a.data_hora, a.van_pet as "van_pet: bool", a.status, a.valor_cobrado, a.criado_em,
            c.nome as cliente_nome,
            p.nome as pet_nome,
            s.nome as servico_nome
        FROM agendamentos a
        JOIN clientes c ON a.cliente_id = c.id
        JOIN pets p ON a.pet_id = p.id
        JOIN servicos s ON a.servico_id = s.id
        ORDER BY a.data_hora ASC
        "#
    )
    .fetch_all(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(agendamentos))
}

pub async fn create_agendamento(
    State(pool): State<SqlitePool>,
    Json(payload): Json<CreateAgendamento>,
) -> Result<(StatusCode, Json<Agendamento>), (StatusCode, String)> {
    let van_pet = payload.van_pet.unwrap_or(false);
    
    let result = sqlx::query!(
        r#"
        INSERT INTO agendamentos (cliente_id, pet_id, servico_id, data_hora, van_pet, status)
        VALUES (?1, ?2, ?3, ?4, ?5, 'pendente')
        "#,
        payload.cliente_id,
        payload.pet_id,
        payload.servico_id,
        payload.data_hora,
        van_pet
    )
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let id = result.last_insert_rowid();

    let agendamento = sqlx::query_as!(
        Agendamento,
        r#"SELECT id, cliente_id, pet_id, servico_id, data_hora, van_pet as "van_pet: bool", status, valor_cobrado, criado_em FROM agendamentos WHERE id = ?1"#,
        id
    )
    .fetch_one(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok((StatusCode::CREATED, Json(agendamento)))
}

#[derive(Deserialize)]
pub struct UpdateStatusAgendamento {
    pub status: String,
}

pub async fn update_status_agendamento(
    State(pool): State<SqlitePool>,
    Path(id): Path<i64>,
    Json(payload): Json<UpdateStatusAgendamento>,
) -> Result<StatusCode, (StatusCode, String)> {
    let result = sqlx::query!(
        "UPDATE agendamentos SET status = ?1 WHERE id = ?2",
        payload.status,
        id
    )
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if result.rows_affected() == 0 {
        return Err((StatusCode::NOT_FOUND, "Agendamento não encontrado".to_string()));
    }

    Ok(StatusCode::OK)
}
