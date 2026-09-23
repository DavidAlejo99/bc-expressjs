import { createHash } from 'crypto';

// bcrypt trunca su entrada a 72 bytes. Un JWT largo puede superar ese límite
// y hacer que dos tokens distintos (mismo header + primeros claims) generen
// el mismo hash, rompiendo la rotación de refresh tokens.
// Pre-hasheamos con SHA-256 (salida fija de 64 hex chars) antes de bcrypt.
export function sha256(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
