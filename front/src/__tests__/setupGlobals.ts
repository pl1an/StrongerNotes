/// <reference types="node" />
import { TextEncoder, TextDecoder } from 'util';

Object.assign(globalThis, { TextEncoder, TextDecoder });
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
