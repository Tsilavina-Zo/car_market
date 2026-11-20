const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Car Marketplace API!",
        status: "success"
    });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT current_database()"
        );

        res.json({
            message: "Database connected successfully!",
            database: result.rows[0].current_database
        });
    } catch (error) {
        res.status(500).json({
            message: "Database connection failed",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
