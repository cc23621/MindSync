const express = require('express');
const { createContent, getAllContents, getContentsByType } = require('../controllers/contentController');
const router = express.Router();

router.post('/', createContent);          // Criar
router.get('/', getAllContents);          // Listar todos
router.get('/filter', getContentsByType); // Filtrar por tipo

module.exports = router;
