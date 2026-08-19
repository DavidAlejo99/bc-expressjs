# Proyecto Semana 3 — API REST en Capas: Jardín Infantil Privado

**Aprendiz:** David Esteban Alejo Baracaldo
**Ficha:** 3228973A
**Dominio asignado:** Jardín infantil privado

## Recurso: Child (niño matriculado)

Misma API de la semana 2, ahora refactorizada en arquitectura de 4 capas: `routes → controllers → services → repositories`. Datos en memoria (llega base de datos real en la semana 5).

- `id`, `createdAt`: autogenerados
- `name`: nombre del niño
- `group`: salón/grupo (Sala Cuna, Maternal, Párvulos, Pre-jardín, Jardín, Transición)
- `monthlyFee`: mensualidad
- `active`: matriculado actualmente o retirado

## Arquitectura

- **`repositories/children.repository.ts`**: único punto de acceso al store en memoria, todos los métodos `async`.
- **`services/children.service.ts`**: paginación y reglas de negocio, cero imports de Express.
- **`controllers/children.controller.ts`**: extrae datos de `req`, llama al service, responde — sin lógica propia.
- **`routes/children.routes.ts`**: solo mapea URLs a funciones del controller.

## Endpoints

| Método | Ruta | Status | Descripción |
|--------|------|--------|-------------|
| GET | `/api/v1/children?page=&limit=` | 200 | Listar paginado |
| GET | `/api/v1/children/:id` | 200 / 404 | Obtener por ID |
| POST | `/api/v1/children` | 201 | Matricular niño nuevo |
| PUT | `/api/v1/children/:id` | 200 / 404 | Actualizar datos |
| DELETE | `/api/v1/children/:id` | 204 / 404 | Dar de baja |

## Contratos de respuesta

```json
{ "data": [...], "total": 3, "page": 1, "limit": 2 }
{ "data": { "id": 1, "name": "...", ... } }
{ "error": "Not Found", "message": "Child 999 not found" }
```

## Cómo ejecutar

```bash
pnpm install
pnpm dev
```