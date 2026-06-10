/// <reference path="ace-modules.d.ts" />

declare namespace AceAjax {
  interface Editor {
    getValue(): string;
    setValue(val: string, cursorPos?: number): void;
    setTheme(theme: string): void;
    setFontSize(size: number | string): void;
    session: EditSession;
    setOptions(options: Record<string, unknown>): void;
    on(event: string, fn: () => void): void;
    destroy(): void;
  }
  interface EditSession {
    setMode(mode: string): void;
    getMode(): string;
  }
  function edit(el: string | HTMLElement): Editor;
  function require(module: string): unknown;
}

declare const ace: typeof AceAjax;
export = ace;
