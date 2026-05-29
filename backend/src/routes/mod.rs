use axum::{
    routing::{get, post},
    Router,
};
use sqlx::SqlitePool;

use crate::handlers::servico_handler;

pub fn app_routes() -> Router<SqlitePool> {
    Router::new()
        .route("/servicos", get(servico_handler::list_servicos))
        .route("/admin/servicos", post(servico_handler::create_servico))
}
