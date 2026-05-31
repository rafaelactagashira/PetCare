use axum::{
    extract::State,
    http::StatusCode,
    Json,
};
use sqlx::SqlitePool;
use crate::models::pet::{Pet, CreatePet};

pub async fn list_pets(
    State(pool): State<SqlitePool>,
) -> Result<Json<Vec<Pet>>, (StatusCode, String)> {
    let pets = sqlx::query_as!(
        Pet,
        r#"SELECT id, cliente_id, nome, especie, raca, porte, idade, peso, tipo_tosa, observacoes_comportamento, criado_em FROM pets ORDER BY criado_em DESC"#
    )
    .fetch_all(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(pets))
}

pub async fn create_pet(
    State(pool): State<SqlitePool>,
    Json(payload): Json<CreatePet>,
) -> Result<(StatusCode, Json<Pet>), (StatusCode, String)> {
    let result = sqlx::query!(
        r#"
        INSERT INTO pets (cliente_id, nome, especie, raca, porte, idade, peso, tipo_tosa, observacoes_comportamento)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
        "#,
        payload.cliente_id,
        payload.nome,
        payload.especie,
        payload.raca,
        payload.porte,
        payload.idade,
        payload.peso,
        payload.tipo_tosa,
        payload.observacoes_comportamento
    )
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let id = result.last_insert_rowid();

    let pet = sqlx::query_as!(
        Pet,
        r#"SELECT id, cliente_id, nome, especie, raca, porte, idade, peso, tipo_tosa, observacoes_comportamento, criado_em FROM pets WHERE id = ?1"#,
        id
    )
    .fetch_one(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok((StatusCode::CREATED, Json(pet)))
}
