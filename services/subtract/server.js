const express = require("express");

const app = express();
const PORT = 3002;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "subtract", status: "ok" });
});

app.post("/calculate", (req, res) => {
  const { a, b } = req.body;

  if (typeof a !== "number" || typeof b !== "number") {
    return res.status(400).json({ error: "Fields 'a' and 'b' must be numbers." });
  }

  return res.json({ result: a - b });
});

app.listen(PORT, () => {
  console.log(`Subtract service running on http://localhost:${PORT}`);
});