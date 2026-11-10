import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("WISE PRINCE ✝️ — Serveur OK");
});

app.listen(PORT, () => {
  console.log(`WISE PRINCE running on port ${PORT}`);
});
