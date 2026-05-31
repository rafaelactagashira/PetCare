use axum::{
    routing::{get, post, patch},
    Router,
};
use sqlx::SqlitePool;

use crate::handlers::{servico_handler, cliente_handler, pet_handler, agendamento_handler};

pub fn app_routes() -> Router<SqlitePool> {
    Router::new()
        .route("/servicos", get(servico_handler::list_servicos))
        .route("/admin/servicos", post(servico_handler::create_servico))
        
        .route("/clientes", get(cliente_handler::list_clientes))
        .route("/clientes", post(cliente_handler::create_cliente))
        
        .route("/pets", get(pet_handler::list_pets))
        .route("/pets", post(pet_handler::create_pet))
        
        .route("/agendamentos", get(agendamento_handler::list_agendamentos))
        .route("/agendamentos", post(agendamento_handler::create_agendamento))
        .route("/agendamentos/:id/status", patch(agendamento_handler::update_status_agendamento))
}
