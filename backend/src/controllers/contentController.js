const pool = require('../models/db');

// Criar novo conteúdo
const createContent = async (req, res) => {
  const { title, description, type, url } = req.body;

  if (!title || !type || !url) {
    return res.status(400).json({ message: 'Título, tipo e URL são obrigatórios' });
  }

  try {
    const newContent = await pool.query(
      'INSERT INTO contents (title, description, type, url) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, type, url]
    );
    res.status(201).json(newContent.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar conteúdo' });
  }
};

// Listar todos
const getAllContents = async (req, res) => {
  try {
    const allContents = await pool.query('SELECT * FROM contents ORDER BY created_at DESC');
    res.json(allContents.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar conteúdos' });
  }
};

// Filtrar por tipo
const getContentsByType = async (req, res) => {
  const { type } = req.query;
  try {
    const filteredContents = await pool.query('SELECT * FROM contents WHERE type = $1 ORDER BY created_at DESC', [type]);
    res.json(filteredContents.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar conteúdos por tipo' });
  }
};

module.exports = { createContent, getAllContents, getContentsByType };
