# Ace Online IDE

A browser-based Online Code Editor built with [Ace Editor](https://ace.c9.io/).  
Supports multi-language code editing, stdin input, and simulated code execution via a backend API.

## Features
- **Multi-language support**: Python, JavaScript, TypeScript, Java, C, C++, Rust, Go
- **Ace Editor** with syntax highlighting, autocompletion, and snippets
- **Multiple themes**: Monokai, GitHub, Dracula, Tomorrow Night, Solarized Dark
- **Stdin input** for interactive programs
- **Backend API** (`/execute`) that accepts `{ language, code, stdin }` and returns output
- **Kitchen Sink demo** showing all editor features

## Project Structure
```
ace-online-ide/
├── assets/              Static assets (CSS, images)
├── demo/                Demo examples
├── src/                 Ace editor source
├── src-min/             Minified Ace builds
├── src-min-noconflict/  Minified no-conflict builds
├── src-noconflict/      No-conflict Ace builds
├── ace.d.ts             TypeScript definitions for Ace
├── ace-modules.d.ts     TypeScript definitions for Ace modules
├── bower.json           Bower package config
├── ChangeLog            Project changelog
├── index.html           Main editor page
├── kitchen-sink.html    Full feature demo page
├── package.json         Node dependencies
├── Procfile             Heroku process config
├── server1.js           Express backend API
├── texteditor.js        Editor setup helpers
└── webpack-resolver.js  Webpack module resolver
```

## Setup
```bash
npm install
npm start
# Open http://localhost:3000
```

## API
**POST /execute**
```json
{ "language": "python", "code": "print('hello')", "stdin": "" }
```
Returns:
```json
{ "output": "hello\n", "error": false, "time": "0.12s" }
```
