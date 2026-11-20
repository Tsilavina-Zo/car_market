SELECT
    c.id,
    c.brand,
    c.model,
    c.year,
    c.price,
    c.status,
    u.full_name AS seller,
    cat.name AS category
FROM cars c
JOIN users u ON c.user_id = u.id
LEFT JOIN categories cat ON c.category_id = cat.id
ORDER BY c.created_at DESC;

SELECT
    p.id,
    u.full_name AS buyer,
    c.brand,
    c.model,
    p.purchase_price,
    p.status
FROM purchases p
JOIN users u ON p.buyer_id = u.id
JOIN cars c ON p.car_id = c.id;

SELECT COUNT(*)
FROM cars
WHERE status = 'available';

CREATE UNIQUE INDEX unique_completed_purchase
ON purchases(car_id)
WHERE status = 'completed';