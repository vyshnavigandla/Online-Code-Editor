/**
 * texteditor.js
 * Helper module for initialising and configuring the Ace Editor instance.
 * Handles language modes, themes, default templates, and editor options.
 */

const LANGUAGES = [
  {
    id: "python",
    label: "Python",
    aceMode: "ace/mode/python",
    version: "3.11",
    ext: "py",
    template: [
      'name = input("Enter your name: ")',
      'print(f"Hello, {name}!")',
      "print('Sum 1-10:', sum(range(1, 11)))",
    ].join("\n"),
  },
  {
    id: "javascript",
    label: "JavaScript",
    aceMode: "ace/mode/javascript",
    version: "Node 20",
    ext: "js",
    template: [
      'const readline = require("readline");',
      "const rl = readline.createInterface({ input: process.stdin });",
      'rl.on("line", (line) => {',
      '  console.log("Hello,", line.trim() + "!");',
      "  rl.close();",
      "});",
    ].join("\n"),
  },
  {
    id: "typescript",
    label: "TypeScript",
    aceMode: "ace/mode/typescript",
    version: "5.4",
    ext: "ts",
    template: "const name: string = 'World';\nconsole.log(`Hello, ${name}!`);",
  },
  {
    id: "java",
    label: "Java",
    aceMode: "ace/mode/java",
    version: "21",
    ext: "java",
    template: [
      "import java.util.Scanner;",
      "public class Main {",
      "  public static void main(String[] args) {",
      "    Scanner sc = new Scanner(System.in);",
      '    String name = sc.nextLine();',
      '    System.out.println("Hello, " + name + "!");',
      "  }",
      "}",
    ].join("\n"),
  },
  {
    id: "c",
    label: "C",
    aceMode: "ace/mode/c_cpp",
    version: "GCC 13",
    ext: "c",
    template: '#include <stdio.h>\nint main() {\n  char name[100];\n  scanf("%s", name);\n  printf("Hello, %s!\\n", name);\n  return 0;\n}',
  },
  {
    id: "cpp",
    label: "C++",
    aceMode: "ace/mode/c_cpp",
    version: "GCC 13",
    ext: "cpp",
    template: '#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n  string name;\n  getline(cin, name);\n  cout << "Hello, " << name << "!" << endl;\n  return 0;\n}',
  },
  {
    id: "rust",
    label: "Rust",
    aceMode: "ace/mode/rust",
    version: "1.78",
    ext: "rs",
    template: 'use std::io;\nfn main() {\n  let mut name = String::new();\n  io::stdin().read_line(&mut name).unwrap();\n  println!("Hello, {}!", name.trim());\n}',
  },
  {
    id: "go",
    label: "Go",
    aceMode: "ace/mode/golang",
    version: "1.22",
    ext: "go",
    template: 'package main\nimport (\n  "bufio"\n  "fmt"\n  "os"\n)\nfunc main() {\n  scanner := bufio.NewScanner(os.Stdin)\n  scanner.Scan()\n  fmt.Printf("Hello, %s!\\n", scanner.Text())\n}',
  },
];

const THEMES = [
  { id: "monokai",       label: "Monokai",        aceTheme: "ace/theme/monokai" },
  { id: "github",        label: "GitHub Light",    aceTheme: "ace/theme/github" },
  { id: "dracula",       label: "Dracula",         aceTheme: "ace/theme/dracula" },
  { id: "tomorrow_night",label: "Tomorrow Night",  aceTheme: "ace/theme/tomorrow_night" },
  { id: "solarized_dark",label: "Solarized Dark",  aceTheme: "ace/theme/solarized_dark" },
];

const FONT_SIZES = [12, 13, 14, 15, 16, 18, 20];

/**
 * Initialise an Ace editor on the given DOM element.
 * @param {HTMLElement} el  Container element
 * @param {object} opts     Optional overrides (theme, mode, fontSize)
 * @returns {AceAjax.Editor}
 */
function initEditor(el, opts = {}) {
  ace.require("ace/ext/language_tools");
  const editor = ace.edit(el);
  const lang = LANGUAGES.find((l) => l.id === (opts.language || "python")) || LANGUAGES[0];
  const themeObj = THEMES.find((t) => t.id === (opts.theme || "monokai")) || THEMES[0];

  editor.setTheme(themeObj.aceTheme);
  editor.session.setMode(lang.aceMode);
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true,
    showPrintMargin: false,
    fontSize: `${opts.fontSize || 14}px`,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    tabSize: 2,
    useSoftTabs: true,
  });
  editor.setValue(lang.template, -1);
  return editor;
}

/**
 * Change the language mode of an existing editor.
 * @param {AceAjax.Editor} editor
 * @param {string} langId
 */
function setLanguage(editor, langId) {
  const lang = LANGUAGES.find((l) => l.id === langId);
  if (!lang) return;
  editor.session.setMode(lang.aceMode);
  editor.setValue(lang.template, -1);
}

/**
 * Change the visual theme of an existing editor.
 * @param {AceAjax.Editor} editor
 * @param {string} themeId
 */
function setTheme(editor, themeId) {
  const themeObj = THEMES.find((t) => t.id === themeId);
  if (!themeObj) return;
  editor.setTheme(themeObj.aceTheme);
}

if (typeof module !== "undefined") {
  module.exports = { LANGUAGES, THEMES, FONT_SIZES, initEditor, setLanguage, setTheme };
}
