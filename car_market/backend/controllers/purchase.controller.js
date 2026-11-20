
const pool = require("../config/db");

// 1. Demander l'achat d'une voiture
exports.createPurchase = async (req, res) => {
  const client = await pool.connect();

  try {
    const buyerId = req.user.id;
    const { carId } = req.params;

    await client.query("BEGIN");

    // Verrouiller la voiture pendant la transaction
    const carResult = await client.query(
      `SELECT * FROM cars
       WHERE id = $1
       FOR UPDATE`,
      [carId]
    );

    if (carResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Voiture introuvable."
      });
    }

    const car = carResult.rows[0];

    // Empêcher l'achat de sa propre voiture
    if (car.user_id === buyerId) {
      await client.query("ROLLBACK");
      return res.status(403).json({
        message: "Vous ne pouvez pas acheter votre propre voiture."
      });
    }

    // Vérifier la disponibilité
    if (car.status !== "available") {
      await client.query("ROLLBACK");
      return res.status(409).json({
        message: "Cette voiture n'est plus disponible."
      });
    }

    // Créer la demande d'achat
    const purchaseResult = await client.query(
      `INSERT INTO purchases
       (buyer_id, car_id, purchase_price, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [buyerId, carId, car.price]
    );

    const purchase = purchaseResult.rows[0];

    // La voiture devient indisponible
    await client.query(
      `UPDATE cars
       SET status = 'pending'
       WHERE id = $1`,
      [carId]
    );

    // Notifier le propriétaire
    await client.query(
      `INSERT INTO notifications
       (user_id, purchase_id, message)
       VALUES ($1, $2, $3)`,
      [
        car.user_id,
        purchase.id,
        `Un utilisateur souhaite acheter votre ${car.brand} ${car.model}.`
      ]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Demande d'achat envoyée au propriétaire.",
      purchase
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create purchase error:", error);

    return res.status(500).json({
      message: "Erreur lors de la demande d'achat."
    });

  } finally {
    client.release();
  }
};


// 2. Consulter mes achats
exports.getMyPurchases = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.brand, c.model, c.year,
              c.image_url, c.status AS car_status
       FROM purchases p
       JOIN cars c ON c.id = p.car_id
       WHERE p.buyer_id = $1
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      count: result.rows.length,
      purchases: result.rows
    });

  } catch (error) {
    console.error("Get my purchases error:", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des achats."
    });
  }
};


// 3. Consulter les demandes reçues par le vendeur
exports.getReceivedPurchases = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.brand, c.model, c.year,
              u.full_name AS buyer_name,
              u.email AS buyer_email
       FROM purchases p
       JOIN cars c ON c.id = p.car_id
       JOIN users u ON u.id = p.buyer_id
       WHERE c.user_id = $1
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      count: result.rows.length,
      purchases: result.rows
    });

  } catch (error) {
    console.error("Get received purchases error:", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des demandes."
    });
  }
};


// 4. Le propriétaire valide une demande d'achat
exports.validatePurchase = async (req, res) => {
  const client = await pool.connect();

  try {
    const sellerId = req.user.id;
    const { id } = req.params;

    await client.query("BEGIN");

    // Verrouiller la demande et la voiture
    const result = await client.query(
      `SELECT p.*, c.user_id AS seller_id,
              c.status AS car_status
       FROM purchases p
       JOIN cars c ON c.id = p.car_id
       WHERE p.id = $1
       FOR UPDATE OF p, c`,
      [id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Demande d'achat introuvable."
      });
    }

    const purchase = result.rows[0];

    // Vérifier que l'utilisateur est le propriétaire
    if (purchase.seller_id !== sellerId) {
      await client.query("ROLLBACK");
      return res.status(403).json({
        message: "Vous n'êtes pas le propriétaire de cette voiture."
      });
    }

    if (
      purchase.status !== "pending" ||
      purchase.car_status !== "pending"
    ) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        message: "Cette demande ne peut plus être validée."
      });
    }

    // Confirmer l'achat
    await client.query(
      `UPDATE purchases
       SET status = 'completed'
       WHERE id = $1`,
      [id]
    );

    // Marquer la voiture comme vendue
    await client.query(
      `UPDATE cars
       SET status = 'sold'
       WHERE id = $1`,
      [purchase.car_id]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      message: "Achat validé avec succès. La voiture est maintenant vendue."
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Validate purchase error:", error);

    return res.status(500).json({
      message: "Erreur lors de la validation de l'achat."
    });

  } finally {
    client.release();
  }
};
