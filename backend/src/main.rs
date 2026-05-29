pub mod db;
pub mod models;
pub mod handlers;
pub mod routes;

use axum::{
    routing::get,
    Router,
};
use dotenvy::dotenv;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() {
    dotenv().ok();

    // Inicializar o banco de dados
    let pool = db::establish_connection().await;
    db::run_migrations(&pool).await;

    // Configurar o CORS
    let cors = CorsLayer::permissive(); // Em produção, restrinja isso!

    // Configurar rotas da API
    let api_routes = routes::app_routes();

    let app = Router::new()
        .route("/health", get(|| async { "OK" }))
        .nest("/api", api_routes)
        .layer(cors)
        .with_state(pool);

    // Iniciar servidor
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Servidor rodando em http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
