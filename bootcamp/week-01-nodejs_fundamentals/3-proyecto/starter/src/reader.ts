import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Child } from './types.js';

export async function readChildren(): Promise<Child[]> {
  const filePath = join(import.meta.dirname, '..', 'data', 'children.json');
  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw) as Child[];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`No se pudo leer children.json: ${message}`);
  }
}