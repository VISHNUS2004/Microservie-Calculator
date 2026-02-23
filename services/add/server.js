const express = require("express");

const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "add", status: "ok" });
});

app.post("/calculate", (req, res) => {
  const { a, b } = req.body;

  if (typeof a !== "number" || typeof b !== "number") {
    return res.status(400).json({ error: "Fields 'a' and 'b' must be numbers." });
  }

  return res.json({ result: a + b });
});

app.listen(PORT, () => {
  console.log(`Add service running on http://localhost:${PORT}`);
});