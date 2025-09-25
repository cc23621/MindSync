const express = require('express');
const router = express.Router();
const controller = require('../controllers/psychologistController');

// GET todos
router.get('/', controller.getAll);

// GET por id
router.get('/:id', controller.getById);

// POST - criar novo psicólogo
router.post('/', controller.create);

// PUT - atualizar
router.put('/:id', controller.update);

// DELETE - excluir
router.delete('/:id', controller.delete);

// 🔑 NOVA ROTA LOGIN
router.post('/login', controller.login);

module.exports = router;
