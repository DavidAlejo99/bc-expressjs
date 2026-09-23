# Semana 09 — Proyecto: Jardín Infantil (Testing con Jest + Supertest)

API de gestión de niños de un jardín infantil privado (autenticación JWT +
RBAC de la semana 08), esta semana cubierta con una suite completa de
pruebas automatizadas: unitarias con mocks y de integración end-to-end.

## Dominio

| Entidad | Descripción |
|---------|-------------|
| `User` | Personal del jardín. Roles: `user` (educadora/profesor) y `admin` (director/a). |
| `Child` | Niño matriculado: `name`, `enrollmentCode` (único), `group` (Sala Cuna, Maternal, Párvulos, Pre-jardín, Jardín, Transición), `monthlyFee`, `birthDate`, `active`, `createdBy`. |

## Estrategia de testing

| Tipo | Herramienta | Qué prueba |
|------|-------------|------------|
| Unitarias | Jest + `jest.mock()` | Servicios y middlewares en aislamiento, mockeando repositorios y utilidades (`auth.middleware.test.ts`, `children.service.test.ts`, `children.controller.test.ts`) |
| Integración | Supertest + `mongodb-memory-server` | Ciclo HTTP completo contra una base MongoDB en memoria, sin mocks (`auth.routes.test.ts`, `children.routes.test.ts`, `children.repository.test.ts`) |

### Suites de test

- `auth.middleware.test.ts` — `authenticate()` (sin header, header inválido, token inválido, token válido) y `authorize()` (sin usuario, rol no permitido, rol permitido).
- `auth.routes.test.ts` — registro (422 inválido, 409 duplicado), login (422 inválido, 401 sin usuario, 401 password incorrecta) y `/me` (200 con token válido, 401 sin token, 404 con token de usuario eliminado).
- `children.service.test.ts` — CRUD completo con mocks del repositorio, incluida la regla de autorización (dueño o admin) y el caso borde de `update()` devolviendo `null`.
- `children.controller.test.ts` — ramas de error no-Zod de `getAllHandler` y `createHandler`, mockeando el service.
- `children.repository.test.ts` — filtro `createdBy` de `findAllChildren()` contra Mongo real.
- `children.routes.test.ts` — CRUD completo end-to-end: 201/401/422 al crear, 200/404 al leer, 200 (dueño/admin) / 403 (no-dueño) al actualizar, 204/403 al eliminar.

### Resultado de cobertura

Umbral configurado en `jest.config.ts` (80% stmts / 70% branch / 80% funcs / 80% lines) — superado en las cuatro métricas.

## Setup

```bash
pnpm install
pnpm test              # correr toda la suite
pnpm test:coverage     # correr con reporte de cobertura
```

Las pruebas de integración no requieren Docker ni un `.env`: levantan su propia
instancia de MongoDB en memoria (`mongodb-memory-server`) en cada corrida.
