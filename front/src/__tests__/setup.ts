import '@testing-library/jest-dom';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
}

if (typeof global !== "undefined") {
  (global as unknown as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
}
