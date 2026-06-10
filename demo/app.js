/**
 * demo/app.js
 * Main front-end controller for index.html.
 * Wires up language/theme/font selectors, the Run button,
 * copy/clear helpers, and the /execute API call.
 */

(function () {
  "use strict";

  /* ── DOM refs ────────────────────────────────────────────── */
  const langSelect   = document.getElementById("langSelect");
  const themeSelect  = document.getElementById("themeSelect");
  const fontSelect   = document.getElementById("fontSelect");
  const runBtn       = document.getElementById("runBtn");
  const copyCodeBtn  = document.getElementById("copyCodeBtn");
  const clearCodeBtn = document.getElementById("clearCodeBtn");
  const stdinInput   = document.getElementById("stdinInput");
  const outputArea   = document.getElementById("outputArea");
  const execTimeEl   = document.getElementById("execTime");
  const copyOutBtn   = document.getElementById("copyOutBtn");
  const clearOutBtn  = document.getElementById("clearOutBtn");
  const fileNameEl   = document.getElementById("fileName");
  const versionBadge = document.getElementById("versionBadge");
  const statusLang   = document.getElementById("statusLang");

  /* ── Populate selects ────────────────────────────────────── */
  LANGUAGES.forEach((l) => {
    const opt = document.createElement("option");
    opt.value = l.id;
    opt.textContent = l.label;
    langSelect.appendChild(opt);
  });

  THEMES.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.label;
    themeSelect.appendChild(opt);
  });

  /* ── Init editor ─────────────────────────────────────────── */
  const editor = initEditor(document.getElementById("editor"), {
    language: "python",
    theme: "monokai",
    fontSize: 14,
  });

  /* ── Language change ─────────────────────────────────────── */
  langSelect.addEventListener("change", () => {
    const lang = LANGUAGES.find((l) => l.id === langSelect.value);
    if (!lang) return;
    setLanguage(editor, lang.id);
    const ext = lang.ext || lang.id;
    fileNameEl.textContent = `main.${ext}`;
    versionBadge.textContent = `${lang.label} ${lang.version}`;
    statusLang.textContent   = `⊕ ${lang.label}`;
    runBtn.textContent       = `▶  Run ${lang.label}`;
    clearOutput();
  });

  /* ── Theme change ────────────────────────────────────────── */
  themeSelect.addEventListener("change", () => {
    setTheme(editor, themeSelect.value);
  });

  /* ── Font size change ────────────────────────────────────── */
  fontSelect.addEventListener("change", () => {
    editor.setFontSize(`${fontSelect.value}px`);
  });

  /* ── Copy / Clear code ───────────────────────────────────── */
  copyCodeBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(editor.getValue()).catch(() => {});
  });
  clearCodeBtn.addEventListener("click", () => {
    editor.setValue("", -1);
  });

  /* ── Copy / Clear output ─────────────────────────────────── */
  copyOutBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(outputArea.innerText).catch(() => {});
  });
  clearOutBtn.addEventListener("click", clearOutput);

  function clearOutput() {
    outputArea.innerHTML = `
      <div class="output-placeholder">
        <span class="placeholder-icon">▶</span>
        <span>Press Run to execute your code</span>
      </div>`;
    execTimeEl.classList.add("hidden");
    copyOutBtn.classList.add("hidden");
    clearOutBtn.classList.add("hidden");
  }

  /* ── Run ─────────────────────────────────────────────────── */
  runBtn.addEventListener("click", runCode);

  async function runCode() {
    const language = langSelect.value;
    const code     = editor.getValue();
    const stdin    = stdinInput.value;

    runBtn.disabled   = true;
    runBtn.innerHTML  = '<span class="spin">⟳</span> &nbsp;Executing…';
    outputArea.innerHTML = `<div style="color:var(--text-muted)"><span class="spin">●</span> Running ${LANGUAGES.find(l=>l.id===language)?.label || language} code…</div>`;
    execTimeEl.classList.add("hidden");
    copyOutBtn.classList.add("hidden");
    clearOutBtn.classList.add("hidden");

    const start = Date.now();

    try {
      /* Try the local /execute endpoint first; fall back to Claude API */
      let output, isError;

      const localRes = await fetch("/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code, stdin }),
      }).catch(() => null);

      if (localRes && localRes.ok) {
        const data = await localRes.json();
        output  = data.output;
        isError = data.error;
      } else {
        /* Fallback: Claude API as execution engine */
        const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: "You are a code execution engine. Return ONLY the exact stdout/stderr output a real interpreter would produce. No commentary, no markdown.",
            messages: [{
              role: "user",
              content: `Language: ${language}\nStdin:\n${stdin || "(empty)"}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\nExecute and return exact output.`,
            }],
          }),
        });
        const claudeData = await claudeRes.json();
        output  = claudeData.content?.map(b => b.text || "").join("") || "No output.";
        isError = /error|exception|traceback|syntaxerror|typeerror/i.test(output);
      }

      const elapsed = ((Date.now() - start) / 1000).toFixed(2);
      execTimeEl.textContent = `⏱ ${elapsed}s`;
      execTimeEl.classList.remove("hidden");
      copyOutBtn.classList.remove("hidden");
      clearOutBtn.classList.remove("hidden");

      const statusClass = isError ? "error" : "success";
      const statusText  = isError ? "● Error" : "● Success";
      outputArea.innerHTML =
        `<div class="output-status ${statusClass}">${statusText}</div>` +
        `<div class="${isError ? "output-error" : "output-success"}">${escapeHtml(output)}</div>`;

    } catch (err) {
      outputArea.innerHTML =
        `<div class="output-status error">● Error</div>` +
        `<div class="output-error">Failed to connect to execution service.\n${err.message}</div>`;
    }

    const lang = LANGUAGES.find(l => l.id === language);
    runBtn.disabled  = false;
    runBtn.innerHTML = `▶ &nbsp;Run ${lang?.label || language}`;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();
