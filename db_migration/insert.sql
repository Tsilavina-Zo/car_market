
INSERT INTO users (id, full_name, email, password, phone) VALUES
('11111111-1111-4111-8111-111111111111', 'Jean Rakoto', 'jean@gmail.com', '$2b$10$fakehash1', '0341234567'),
('22222222-2222-4222-8222-222222222222', 'Marie Randria', 'marie@gmail.com', '$2b$10$fakehash2', '0321234567'),
('33333333-3333-4333-8333-333333333333', 'Andry Rabe', 'andry@gmail.com', '$2b$10$fakehash3', '0331234567'),
('44444444-4444-4444-8444-444444444444', 'Sarah Rakoto', 'sarah@gmail.com', '$2b$10$fakehash4', '0347654321'),
('55555555-5555-4555-8555-555555555555', 'Hery Andrian', 'hery@gmail.com', '$2b$10$fakehash5', '0327654321'),
('66666666-6666-4666-8666-666666666666', 'Lova Rasoanaivo', 'lova@gmail.com', '$2b$10$fakehash6', '0337654321'),
('77777777-7777-4777-8777-777777777777', 'Nina Rakotomalala', 'nina@gmail.com', '$2b$10$fakehash7', '0349876543'),
('88888888-8888-4888-8888-888888888888', 'Tiana Razafy', 'tiana@gmail.com', '$2b$10$fakehash8', '0329876543');


-- Si tu as déjà exécuté les INSERT précédents,
-- ne réinsère pas les catégories.
INSERT INTO categories (name) VALUES
('SUV'),
('Berline'),
('Citadine'),
('4x4'),
('Coupé'),
('Utilitaire')
ON CONFLICT (name) DO NOTHING;


INSERT INTO cars (
    id, user_id, category_id, brand, model,
    year, price, mileage, fuel_type,
    transmission, description, image_url, status
) VALUES

(
'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
'11111111-1111-4111-8111-111111111111',
1, 'Toyota', 'RAV4', 2020, 85000000,
45000, 'Diesel', 'Automatic',
'Toyota RAV4 en excellent état, très bien entretenue.',
'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b',
'available'
),

(
'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
'22222222-2222-4222-8222-222222222222',
2, 'BMW', 'Serie 3', 2019, 95000000,
52000, 'Diesel', 'Automatic',
'BMW Série 3, intérieur cuir, très confortable.',
'https://images.unsplash.com/photo-1555215695-3004980ad54e',
'available'
),

(
'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
'33333333-3333-4333-8333-333333333333',
3, 'Hyundai', 'i10', 2021, 38000000,
25000, 'Petrol', 'Manual',
'Petite citadine économique, idéale pour la ville.',
'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2',
'available'
),

(
'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
'44444444-4444-4444-8444-444444444444',
4, 'Toyota', 'Land Cruiser', 2018, 180000000,
70000, 'Diesel', 'Manual',
'4x4 robuste, adapté aux longs trajets et routes difficiles.',
'https://images.unsplash.com/photo-1519245659620-e859806a8d3b',
'available'
),

(
'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
'55555555-5555-4555-8555-555555555555',
2, 'Mercedes-Benz', 'Classe C', 2020, 110000000,
30000, 'Diesel', 'Automatic',
'Mercedes Classe C, finition premium.',
'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8',
'sold'
),

(
'ffffffff-ffff-4fff-8fff-ffffffffffff',
'11111111-1111-4111-8111-111111111111',
3, 'Suzuki', 'Swift', 2022, 42000000,
18000, 'Petrol', 'Manual',
'Suzuki Swift récente, faible consommation.',
'https://images.unsplash.com/photo-1590362891991-f776e747a588',
'available'
),

(
'10101010-1010-4010-8010-101010101010',
'66666666-6666-4666-8666-666666666666',
1, 'Nissan', 'Qashqai', 2019, 78000000,
60000, 'Diesel', 'Automatic',
'SUV familial spacieux et confortable.',
'https://images.unsplash.com/photo-1511919884226-fd3cad34687c',
'pending'
),

(
'20202020-2020-4020-8020-202020202020',
'77777777-7777-4777-8777-777777777777',
5, 'Audi', 'A5', 2021, 125000000,
22000, 'Petrol', 'Automatic',
'Audi A5 coupé, design sportif et élégant.',
'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6',
'available'
),

(
'30303030-3030-4030-8030-303030303030',
'88888888-8888-4888-8888-888888888888',
4, 'Mitsubishi', 'Pajero', 2017, 95000000,
85000, 'Diesel', 'Automatic',
'Mitsubishi Pajero, bon état général.',
'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
'available'
),

(
'40404040-4040-4040-8040-404040404040',
'33333333-3333-4333-8333-333333333333',
6, 'Toyota', 'Hiace', 2019, 72000000,
65000, 'Diesel', 'Manual',
'Utilitaire spacieux, idéal pour le transport.',
'https://images.unsplash.com/photo-1566933293069-b55c7f326dd4',
'available'
);


INSERT INTO purchases (
    id, buyer_id, car_id, purchase_price, status
) VALUES

(
'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa',
'44444444-4444-4444-8444-444444444444',
'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
110000000,
'completed'
),

(
'bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb',
'55555555-5555-4555-8555-555555555555',
'10101010-1010-4010-8010-101010101010',
78000000,
'pending'
),

(
'cccccccc-3333-4333-8333-cccccccccccc',
'66666666-6666-4666-8666-666666666666',
'30303030-3030-4030-8030-303030303030',
95000000,
'cancelled'
),

(
'dddddddd-4444-4444-8444-dddddddddddd',
'77777777-7777-4777-8777-777777777777',
'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
38000000,
'completed'
);