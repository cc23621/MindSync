const pool = require("../../src/models/db"); // conexão com Postgres

// Registrar emoção
const createEmotion = async (req, res) => {
  try {
    const { userId, type, count, date } = req.body;

    if (!userId || !type) {
      return res.status(400).json({ error: "Campos obrigatórios: userId e type" });
    }

    const result = await pool.query(
      "INSERT INTO graficos (user_id, type, count, date) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, type, count || 1, date ? new Date(date) : new Date()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao cadastrar emoção", err);
    res.status(500).json({ error: "Erro ao cadastrar emoção" });
  }
};

// Buscar emoções por mês/ano
const getEmotionsByMonth = async (req, res) => {
  try {
    const { userId, month, year } = req.query;
    if (!userId || !month || !year) {
      return res.status(400).json({ error: "Campos obrigatórios: userId, month e year" });
    }

    const result = await pool.query(
      `SELECT type, SUM(count) as total, date
       FROM graficos
       WHERE user_id = $1
       AND EXTRACT(MONTH FROM date) = $2
       AND EXTRACT(YEAR FROM date) = $3
       GROUP BY type, date
       ORDER BY date`,
      [userId, month, year]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar emoções", err);
    res.status(500).json({ error: "Erro ao buscar emoções" });
  }
};

module.exports = { createEmotion, getEmotionsByMonth };
