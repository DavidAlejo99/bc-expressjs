import { createHash } from 'crypto';

// bcrypt trunca su entrada a 72 bytes — un JWT largo puede superar ese límite
// y romper la rotación de refresh tokens. Pre-hasheamos con SHA-256 antes de bcrypt.
export function sha256(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
