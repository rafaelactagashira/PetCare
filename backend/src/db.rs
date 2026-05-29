use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};
use std::env;

pub async fn establish_connection() -> SqlitePool {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to SQLite database")
}

pub async fn run_migrations(pool: &SqlitePool) {
    sqlx::migrate!("./migrations")
        .run(pool)
        .await
        .expect("Failed to run database migrations");
}
