const db = require('../models/db');
const bcrypt = require('bcryptjs');

exports.getAll = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, name, email, crp FROM psychologists');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar psicólogos' });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(
      'SELECT id, name, email, crp FROM psychologists WHERE id = $1',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Psicólogo não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar psicólogo' });
  }
};

exports.create = async (req, res) => {
  const { name, email, password, crp } = req.body;
  if (!name || !email || !password || !crp) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      'INSERT INTO psychologists (name, email, password, crp) VALUES ($1, $2, $3, $4) RETURNING id, name, email, crp',
      [name, email, hash, crp]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }
    res.status(400).json({ message: 'Erro ao cadastrar psicólogo', error: err.detail });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, email, crp } = req.body;
  try {
    await db.query(
      'UPDATE psychologists SET name = $1, email = $2, crp = $3 WHERE id = $4',
      [name, email, crp, id]
    );
    res.json({ message: 'Dados atualizados com sucesso' });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar dados' });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM psychologists WHERE id = $1', [id]);
    res.json({ message: 'Conta excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir psicólogo' });
  }
};

// 🔑 NOVO MÉTODO LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await db.query(
      'SELECT * FROM psychologists WHERE email = $1',
      [email]
    );
    const psicologo = rows[0];

    if (!psicologo) {
      return res.status(404).json({ message: 'Psicólogo não encontrado' });
    }

    const senhaConfere = await bcrypt.compare(password, psicologo.password);
    if (!senhaConfere) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    return res.status(200).json({
      message: 'Login realizado com sucesso',
      user: {
        id: psicologo.id,
        nome: psicologo.name,
        email: psicologo.email,
        crp: psicologo.crp
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no login do psicólogo' });
  }
};
