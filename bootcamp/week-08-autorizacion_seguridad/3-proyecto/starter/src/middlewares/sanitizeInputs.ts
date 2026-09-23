import { Request, Response, NextFunction } from 'express';
import mongoSanitize from 'express-mongo-sanitize';

// express-mongo-sanitize@2.x hace `req.query = sanitizedTarget` al final de su
// middleware, y en Express 5 `req.query` es un getter sin setter — eso rompe
// con "Cannot set property query of #<IncomingMessage> which has only a getter".
//
// mongoSanitize.sanitize() ya sanitiza el objeto MUTÁNDOLO en el mismo lugar
// (borra y reinserta las keys prohibidas), así que no necesitamos reasignar
// req.query — basta con llamarla y descartar el valor de retorno.
export function sanitizeInputs(req: Request, _res: Response, next: NextFunction): void {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(req.query);
  next();
}
