use axum::{
    extract::{State, Path},
    http::StatusCode,
    Json,
};
use sqlx::SqlitePool;
use crate::models::servico::{Servico, CreateServico};

pub async fn list_servicos(
    State(pool): State<SqlitePool>,
) -> Result<Json<Vec<Servico>>, (StatusCode, String)> {
    let servicos = sqlx::query_as!(
        Servico,
        r#"SELECT id, nome, descricao, valor, duracao_minutos, ativo as "ativo: bool" FROM servicos"#
    )
    .fetch_all(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(servicos))
}

pub async fn create_servico(
    State(pool): State<SqlitePool>,
    Json(payload): Json<CreateServico>,
) -> Result<(StatusCode, Json<Servico>), (StatusCode, String)> {
    let ativo = payload.ativo.unwrap_or(true);
    let result = sqlx::query!(
        r#"
        INSERT INTO servicos (nome, descricao, valor, duracao_minutos, ativo)
        VALUES (?1, ?2, ?3, ?4, ?5)
        "#,
        payload.nome,
        payload.descricao,
        payload.valor,
        payload.duracao_minutos,
        ativo
    )
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let id = result.last_insert_rowid();

    let servico = Servico {
        id,
        nome: payload.nome,
        descricao: payload.descricao,
        valor: payload.valor,
        duracao_minutos: payload.duracao_minutos,
        ativo,
    };

    Ok((StatusCode::CREATED, Json(servico)))
}
