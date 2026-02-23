const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

const SERVICE_MAP = {
  add: "http://localhost:3001/calculate",
  subtract: "http://localhost:3002/calculate",
  multiply: "http://localhost:3003/calculate",
  divide: "http://localhost:3004/calculate"
};

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/health", (_req, res) => {
  res.json({ service: "api-gateway", status: "ok" });
});

app.post("/api/calculate", async (req, res) => {
  const { operation, a, b } = req.body;

  if (!SERVICE_MAP[operation]) {
    return res.status(400).json({
      error: "Invalid operation. Use add, subtract, multiply, or divide."
    });
  }

  if (typeof a !== "number" || typeof b !== "number") {
    return res.status(400).json({
      error: "Fields 'a' and 'b' must be numbers."
    });
  }

  try {
    const response = await axios.post(SERVICE_MAP[operation], { a, b });
    return res.json({
      operation,
      a,
      b,
      result: response.data.result
    });
  } catch (error) {
    return res.status(502).json({
      error: "Operation service unavailable.",
      detail: error.message
    });
  }
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});