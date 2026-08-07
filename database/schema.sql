-- ===========================================
-- Hybrid Cloud Monitor Database Schema
-- ===========================================

-- Drop existing tables (development only)
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS checks CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ===========================================
-- USERS
-- ===========================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- SERVICES
-- ===========================================

CREATE TABLE services (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    name VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,

    service_type VARCHAR(30) NOT NULL,

    check_interval INTEGER DEFAULT 60,

    status VARCHAR(20) DEFAULT 'Unknown',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ===========================================
-- CHECKS
-- ===========================================

CREATE TABLE checks (

    id SERIAL PRIMARY KEY,

    service_id INTEGER NOT NULL,

    status VARCHAR(20),

    response_time_ms INTEGER,

    http_status INTEGER,

    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_service
        FOREIGN KEY(service_id)
        REFERENCES services(id)
        ON DELETE CASCADE
);

-- ===========================================
-- ALERTS
-- ===========================================

CREATE TABLE alerts (

    id SERIAL PRIMARY KEY,

    service_id INTEGER NOT NULL,

    severity VARCHAR(20),

    message TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_alert_service
        FOREIGN KEY(service_id)
        REFERENCES services(id)
        ON DELETE CASCADE
);

-- ===========================================
-- INDEXES
-- ===========================================

CREATE INDEX idx_user_email
ON users(email);

CREATE INDEX idx_service_user
ON services(user_id);

CREATE INDEX idx_checks_service
ON checks(service_id);

CREATE INDEX idx_alert_service
ON alerts(service_id);