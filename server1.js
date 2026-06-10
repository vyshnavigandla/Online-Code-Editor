/**
 * server1.js
 * Express backend API for the Ace Online IDE.
 *
 * Endpoints:
 *   POST /execute   — Accept { language, code, stdin }, simulate execution,
 *                     return { output, error, time }
 *   GET  /          — Serve index.html
 *   GET  /kitchen-sink — Serve kitchen-sink.html
 *
 * For a production setup, replace the simulateExecution() stub with
 * real sandboxed execution (e.g. Docker subprocess, Judge0 API, etc.)
 */

const express    = require("express");
const cors       = require("cors");
const bodyParser = require("body-parser");
const path       = require("path");

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

/* ------------------------------------------------------------------ */
/* Language metadata                                                    */
/* ------------------------------------------------------------------ */
const SUPPORTED_LANGUAGES = [
  "python", "javascript", "typescript", "java", "c", "cpp", "rust", "go",
];

/* ------------------------------------------------------------------ */
/* POST /execute                                                        */
/* ------------------------------------------------------------------ */
app.post("/execute", async (req, res) => {
  const { language, code, stdin } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: true, output: "Missing language or code." });
  }
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    return res.status(400).json({ error: true, output: `Unsupported language: ${language}` });
  }

  const start = Date.now();

  try {
    const result = await simulateExecution(language, code, stdin || "");
    const elapsed = ((Date.now() - start) / 1000).toFixed(2) + "s";
    return res.json({ output: result.output, error: result.isError, time: elapsed });
  } catch (err) {
    return res.status(500).json({ error: true, output: "Execution service error: " + err.message });
  }
});

/* ------------------------------------------------------------------ */
/* Serve HTML pages                                                     */
/* ------------------------------------------------------------------ */
app.get("/", (_req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/kitchen-sink", (_req, res) => res.sendFile(path.join(__dirname, "kitchen-sink.html")));

/* ------------------------------------------------------------------ */
/* simulateExecution                                                    */
/* Stub — replace with real sandboxed execution in production.         */
/* ------------------------------------------------------------------ */
async function simulateExecution(language, code, stdin) {
  // Minimal heuristic checks to demonstrate error detection
  const lower = code.toLowerCase();
  const isError =
    (language === "python"     && lower.includes("syntax error")) ||
    (language === "javascript" && lower.includes("throw new error")) ||
    (language === "java"       && !lower.includes("class main"));

  if (isError) {
    return { isError: true, output: getSampleError(language) };
  }

  // Return a stub "hello" output using the first line of stdin
  const firstLine = (stdin || "World").split("\n")[0].trim() || "World";
  const outputs = {
    python:     `Hello, ${firstLine}!\nSum 1-10: 55`,
    javascript: `Hello, ${firstLine}!`,
    typescript: `Hello, ${firstLine}!`,
    java:       `Hello, ${firstLine}!`,
    c:          `Hello, ${firstLine}!`,
    cpp:        `Hello, ${firstLine}!`,
    rust:       `Hello, ${firstLine}!`,
    go:         `Hello, ${firstLine}!`,
  };

  return { isError: false, output: outputs[language] || "Done." };
}

function getSampleError(language) {
  const errors = {
    python:     "  File \"main.py\", line 1\nSyntaxError: invalid syntax",
    javascript: "Error: thrown at line 1\n    at Object.<anonymous>",
    java:       "error: class Main is public, should be declared in a file named Main.java",
  };
  return errors[language] || "Runtime error.";
}

/* ------------------------------------------------------------------ */
/* Start                                                                */
/* ------------------------------------------------------------------ */
app.listen(PORT, () => {
  console.log(`Ace Online IDE server running → http://localhost:${PORT}`);
});
