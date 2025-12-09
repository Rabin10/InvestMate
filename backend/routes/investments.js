import express from "express";
import { query } from "../db.js";
import { ensureAuth } from "../middleware/ensureAuth.js";
import { getCurrentPrice } from "../services/prices.js";

const router = express.Router();

router.get("/", ensureAuth, async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM investments WHERE user_id = $1 ORDER BY buy_date ASC",
      [req.user.id]
    );

    const rows = await Promise.all(
      result.rows.map(async (inv) => {
        const currentPrice = await getCurrentPrice(inv.symbol, inv.asset_type);

        return { ...inv, current_price: currentPrice };
      })
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch investments" });
  }
});

router.post("/", ensureAuth, async (req, res) => {
  const { symbol, asset_type, shares, buy_price, buy_date, notes } = req.body;

  if (!symbol || !shares || !buy_price || !buy_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await query(
      `INSERT INTO investments
       (user_id, symbol, asset_type, shares, buy_price, buy_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, symbol.toUpperCase(), asset_type, shares, buy_price, buy_date, notes || null]
    );

    const inv = result.rows[0];
    const currentPrice = await getCurrentPrice(inv.symbol, inv.asset_type);

    res.status(201).json({ ...inv, current_price: currentPrice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create investment" });
  }
});

router.put("/:id", ensureAuth, async (req, res) => {
  const { id } = req.params;
  const { symbol, asset_type, shares, buy_price, buy_date, notes } = req.body;

  try {
    const result = await query(
      `UPDATE investments SET
         symbol = $1,
         asset_type = $2,
         shares = $3,
         buy_price = $4,
         buy_date = $5,
         notes = $6
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [
        symbol.toUpperCase(),
        asset_type,
        shares,
        buy_price,
        buy_date,
        notes || null,
        id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    const inv = result.rows[0];
    const currentPrice = await getCurrentPrice(inv.symbol, inv.asset_type);

    res.json({ ...inv, current_price: currentPrice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update investment" });
  }
});

router.delete("/:id", ensureAuth, async (req, res) => {
  const { id } = req.params;
  try {
    await query(
      "DELETE FROM investments WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete investment" });
  }
});

export default router;
