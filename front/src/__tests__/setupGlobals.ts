/// <reference types="node" />
import { TextEncoder, TextDecoder } from "util";

Object.defineProperty(globalThis, "TextEncoder", { value: TextEncoder });
Object.defineProperty(globalThis, "TextDecoder", { value: TextDecoder });

process.env.VITE_API_URL = "http://localhost:3000";
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
}

if (typeof global !== "undefined") {
  (global as unknown as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
}
