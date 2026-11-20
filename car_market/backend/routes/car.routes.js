const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");

const {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
} = require("../controllers/car.controller");

router.get("/", getAllCars);
router.get("/:id", getCarById);

router.post("/", verifyToken, createCar);
router.put("/:id", verifyToken, updateCar);
router.delete("/:id", verifyToken, deleteCar);

module.exports = router;
