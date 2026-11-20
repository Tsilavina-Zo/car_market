
const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");

const {
  createPurchase,
  getMyPurchases,
  getReceivedPurchases,
  validatePurchase
} = require("../controllers/purchase.controller");

// Toutes les routes nécessitent une authentification
router.use(verifyToken);

router.post("/:carId", createPurchase);

router.get("/my", getMyPurchases);

router.get("/received", getReceivedPurchases);

router.put("/:id/validate", validatePurchase);

module.exports = router;
