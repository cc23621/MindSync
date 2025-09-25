const express = require("express");
const { createEmotion, getEmotionsByMonth } = require("../controllers/emotionControllers");

const router = express.Router();

router.post("/", createEmotion);   // registrar emoção
router.get("/", getEmotionsByMonth); // buscar emoções por mês/ano

module.exports = router;
