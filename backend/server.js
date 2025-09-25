require("dotenv").config();
const http = require("http");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

// Função que retorna os dados da tabela (para uso interno ou importação)
async function getTableData(table) {
  // Segurança: só permitir tabelas conhecidas
  const allowedTables = [
    "users",
    "psychologists",
    "psychologist_patients",
    "humor_registros",
    "emocoes",
    "graficos",
    "diary_entries",
    "OTP",
    "User"
  ];

  if (!allowedTables.includes(table)) {
    throw new Error("Tabela não permitida");
  }

  // Cada tabela tem sua própria query segura
  switch (table) {
    case "users":
      return await sql`SELECT * FROM users`;
    case "psychologists":
      return await sql`SELECT * FROM psychologists`;
    case "psychologist_patients":
      return await sql`SELECT * FROM psychologist_patients`;
    case "humor_registros":
      return await sql`SELECT * FROM humor_registros`;
    case "emocoes":
      return await sql`SELECT * FROM emocoes`;
    case "graficos":
      return await sql`SELECT * FROM graficos`;
    case "diary_entries":
      return await sql`SELECT * FROM diary_entries`;
    case "OTP":
      return await sql`SELECT * FROM OTP`;
    case "User":
      return await sql`SELECT * FROM User`;
  }
}

// Server HTTP
const requestHandler = async (req, res) => {
  try {
    if (req.url.startsWith("/api/")) {
      const table = req.url.replace("/api/", "").trim();

      if (!table) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Nome da tabela não informado" }));
        return;
      }

      const result = await getTableData(table);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result, null, 2));
    } else {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("API rodando 🚀 | use /api/{tabela} para consultar");
    }
  } catch (err) {
    console.error("Erro ao buscar dados:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message || "Erro ao buscar dados" }));
  }
};

// Start server
http.createServer(requestHandler).listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

// Exportar a função para uso em outros módulos
module.exports = { getTableData };
