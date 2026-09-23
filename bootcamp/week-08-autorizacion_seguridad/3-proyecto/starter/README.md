# Semana 08 — Proyecto: Jardín Infantil (RBAC + Seguridad HTTP)

API de gestión de niños de un jardín infantil privado, con autenticación JWT
(semana 07) más una capa de autorización por roles y seguridad HTTP.

## Dominio

| Entidad | Descripción |
|---------|-------------|
| `User` | Personal del jardín. Roles: `staff` (educadora/profesor) y `admin` (director/a). |
| `Child` | Niño matriculado: `name`, `enrollmentCode` (único), `group` (Sala Cuna, Maternal, Párvulos, Pre-jardín, Jardín, Transición), `monthlyFee`, `birthDate`, `active`, `createdBy`. |

## Reglas de autorización (RBAC)

| Acción | Quién puede |
|--------|-------------|
| `GET /children`, `GET /children/:id` | Cualquier usuario autenticado (`staff` o `admin`) — no hay datos públicos |
| `POST /children` | Cualquier `staff` o `admin` autenticado |
| `PATCH /children/:id` | Quien lo registró (`createdBy`) o un `admin` — verificado en el service, 403 si no aplica |
| `DELETE /children/:id` | Solo `admin` (`requireRole('admin')` en la ruta) |

## Seguridad HTTP

- **Helmet**: 12 headers de seguridad por defecto (CSP, HSTS, X-Frame-Options, etc.)
- **Rate limiting**: límite global de 100 req/15min por IP, y límite estricto de 5 intentos/15min en `/auth/login` y `/auth/register` (fuerza bruta)
- **CORS**: whitelist explícita de orígenes (`localhost:5173`, `localhost:3001`); un origen no listado recibe `403 Forbidden`
- **Sanitización NoSQL**: se eliminan operadores Mongo (`$gt`, `$where`, etc.) de `body`, `params` y `query` antes de llegar a las rutas

## Seguridad de tokens

El refresh token se guarda **hasheado** (SHA-256 + bcrypt) en la base de datos,
nunca en texto plano. Al refrescar, el token entrante se re-hashea y se compara
contra el hash almacenado — si no coincide (porque ya fue rotado o revocado),
la petición se rechaza con `401`. Esto evita que un refresh token robado o uno
ya rotado (post-logout) siga siendo válido.

## Bugs reales encontrados y corregidos durante el desarrollo

1. **Wildcard de Express 5 (`app.options('*', ...)`)**: en Express 5, `path-to-regexp` v8 exige nombrar el wildcard (`/*splat`) — el `*` suelto revienta el servidor al arrancar.
2. **`express-mongo-sanitize@2.2.0` incompatible con Express 5**: la librería intenta reasignar `req.query`, que en Express 5 es un getter sin setter (`Cannot set property query`). Se resolvió con un middleware propio que usa `mongoSanitize.sanitize()` directamente (que muta el objeto in-place) sin reasignar `req.query`.
3. **CORS bloqueado devolvía 500 en vez de 403**: el callback de whitelist de `cors` lanza un `Error` genérico; se agregó un caso en `errorHandler` para mapearlo a `403`.

## Setup

```bash
cp .env.example .env   # o genera secretos con: openssl rand -base64 64
docker compose up -d
pnpm install
pnpm approve-builds     # aprobar build nativo de bcrypt
pnpm dev
```

Usuarios semilla: `staff@test.com` / `Staff1234!` y `admin@test.com` / `Admin1234!`.
