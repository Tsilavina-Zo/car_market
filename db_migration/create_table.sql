CREATE DATABASE car_marketplace;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE cars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    category_id INTEGER REFERENCES categories(id),
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    mileage INTEGER,
    fuel_type VARCHAR(50),
    transmission VARCHAR(50),
    description TEXT,
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'available'
        CHECK (status IN ('available', 'pending', 'sold')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES users(id),
    car_id UUID NOT NULL REFERENCES cars(id),
    purchase_price NUMERIC(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cars_user ON cars(user_id);
CREATE INDEX idx_cars_category ON cars(category_id);
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_purchases_buyer ON purchases(buyer_id);

INSERT INTO categories (name) VALUES
('SUV'),
('Berline'),
('Citadine'),
('4x4'),
('Coupé'),
('Utilitaire');
