use axum::{
    extract::State,
    http::StatusCode,
    Json,
};
use sqlx::SqlitePool;
use crate::models::cliente::{Cliente, CreateCliente};

pub async fn list_clientes(
    State(pool): State<SqlitePool>,
) -> Result<Json<Vec<Cliente>>, (StatusCode, String)> {
    let clientes = sqlx::query_as!(
        Cliente,
        r#"SELECT id, nome, telefone_principal, telefone_emergencia, endereco_cliente, endereco_pet, observacoes, criado_em FROM clientes ORDER BY criado_em DESC"#
    )
    .fetch_all(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(clientes))
}

pub async fn create_cliente(
    State(pool): State<SqlitePool>,
    Json(payload): Json<CreateCliente>,
) -> Result<(StatusCode, Json<Cliente>), (StatusCode, String)> {
    let result = sqlx::query!(
        r#"
        INSERT INTO clientes (nome, telefone_principal, telefone_emergencia, endereco_cliente, endereco_pet, observacoes)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6)
        "#,
        payload.nome,
        payload.telefone_principal,
        payload.telefone_emergencia,
        payload.endereco_cliente,
        payload.endereco_pet,
        payload.observacoes
    )
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let id = result.last_insert_rowid();

    let cliente = sqlx::query_as!(
        Cliente,
        r#"SELECT id, nome, telefone_principal, telefone_emergencia, endereco_cliente, endereco_pet, observacoes, criado_em FROM clientes WHERE id = ?1"#,
        id
    )
    .fetch_one(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok((StatusCode::CREATED, Json(cliente)))
}
