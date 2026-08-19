import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Product } from './types.js';

export async function readProducts(): Promise<Product[]> {
  const filePath = join(import.meta.dirname, '..', 'data', 'products.json');
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw) as Product[];
}