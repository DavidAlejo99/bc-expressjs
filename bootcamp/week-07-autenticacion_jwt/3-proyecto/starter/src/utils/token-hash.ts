import { createHash } from 'crypto';

// bcrypt trunca su entrada a 72 bytes — un JWT es más largo que eso,
// y las partes que cambian entre tokens (iat, exp) quedan después del
// byte 72, lo que hace que bcrypt.compare() no distinga tokens distintos
// del mismo usuario. Prehasheamos con SHA-256 antes de bcrypt para que
// la rotación invalide realmente el token anterior.
export function sha256(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
