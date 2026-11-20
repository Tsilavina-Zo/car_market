const pool = require("../config/db");

// GET ALL CARS
const getAllCars = async (req, res) => {
    try {
        const { search, category, min_price, max_price } = req.query;

        let query = `
            SELECT
                c.*,
                u.full_name AS seller_name,
                cat.name AS category_name
            FROM cars c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN categories cat ON c.category_id = cat.id
            WHERE c.status = 'available'
        `;

        const values = [];

        if (search) {
            values.push(`%${search}%`);
            query += ` AND (
                c.brand ILIKE $${values.length}
                OR c.model ILIKE $${values.length}
            )`;
        }

        if (category) {
            values.push(category);
            query += ` AND cat.id = $${values.length}`;
        }

        if (min_price) {
            values.push(min_price);
            query += ` AND c.price >= $${values.length}`;
        }

        if (max_price) {
            values.push(max_price);
            query += ` AND c.price <= $${values.length}`;
        }

        query += " ORDER BY c.created_at DESC";

        const result = await pool.query(query, values);

        res.status(200).json({
            count: result.rows.length,
            cars: result.rows
        });

    } catch (error) {
        console.error("Get cars error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// GET CAR BY ID
const getCarById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT
                c.*,
                u.full_name AS seller_name,
                u.phone AS seller_phone,
                cat.name AS category_name
            FROM cars c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN categories cat ON c.category_id = cat.id
            WHERE c.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Car not found"
            });
        }

        res.status(200).json({
            car: result.rows[0]
        });

    } catch (error) {
        console.error("Get car error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// CREATE CAR
const createCar = async (req, res) => {
    try {
        const {
            category_id,
            brand,
            model,
            year,
            price,
            mileage,
            fuel_type,
            transmission,
            description,
            image_url
        } = req.body;

        if (!brand || !model || !year || !price) {
            return res.status(400).json({
                message: "Brand, model, year and price are required"
            });
        }

        const currentYear = new Date().getFullYear();

        if (!Number.isInteger(Number(year)) ||
            Number(year) < 1886 ||
            Number(year) > currentYear + 1) {
            return res.status(400).json({
                message: "Invalid car year"
            });
        }

        if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
            return res.status(400).json({
                message: "Price must be greater than zero"
            });
        }

        if (mileage != null &&
            (!Number.isInteger(Number(mileage)) || Number(mileage) < 0)) {
            return res.status(400).json({
                message: "Invalid mileage"
            });
        }

        const result = await pool.query(
            `INSERT INTO cars (
                user_id, category_id, brand, model,
                year, price, mileage, fuel_type,
                transmission, description, image_url
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING *`,
            [
                req.user.id,
                category_id || null,
                brand.trim(),
                model.trim(),
                Number(year),
                Number(price),
                mileage == null ? null : Number(mileage),
                fuel_type || null,
                transmission || null,
                description || null,
                image_url || null
            ]
        );

        res.status(201).json({
            message: "Car published successfully",
            car: result.rows[0]
        });

    } catch (error) {
        console.error("Create car error:", error);

        if (error.code === "23503") {
            return res.status(400).json({
                message: "Invalid category"
            });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};


// UPDATE CAR
const updateCar = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            category_id,
            brand,
            model,
            year,
            price,
            mileage,
            fuel_type,
            transmission,
            description,
            image_url
        } = req.body;

        const result = await pool.query(
            `UPDATE cars
             SET category_id = COALESCE($1, category_id),
                 brand = COALESCE($2, brand),
                 model = COALESCE($3, model),
                 year = COALESCE($4, year),
                 price = COALESCE($5, price),
                 mileage = COALESCE($6, mileage),
                 fuel_type = COALESCE($7, fuel_type),
                 transmission = COALESCE($8, transmission),
                 description = COALESCE($9, description),
                 image_url = COALESCE($10, image_url)
             WHERE id = $11
               AND user_id = $12
               AND status = 'available'
             RETURNING *`,
            [
                category_id ?? null,
                brand?.trim() || null,
                model?.trim() || null,
                year ?? null,
                price ?? null,
                mileage ?? null,
                fuel_type ?? null,
                transmission ?? null,
                description ?? null,
                image_url ?? null,
                id,
                req.user.id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Car not found, not yours, or not editable"
            });
        }

        res.status(200).json({
            message: "Car updated successfully",
            car: result.rows[0]
        });

    } catch (error) {
        console.error("Update car error:", error);

        res.status(500).json({ message: "Internal server error" });
    }
};


// DELETE CAR
const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM cars
             WHERE id = $1
               AND user_id = $2
               AND status = 'available'
             RETURNING id`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Car not found, not yours, or not deletable"
            });
        }

        res.status(200).json({
            message: "Car deleted successfully"
        });

    } catch (error) {
        console.error("Delete car error:", error);

        if (error.code === "23503") {
            return res.status(409).json({
                message: "This car has purchase records and cannot be deleted"
            });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
};
