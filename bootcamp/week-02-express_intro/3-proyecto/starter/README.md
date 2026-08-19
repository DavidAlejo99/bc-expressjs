# Proyecto Semana 2 — API REST Jardín Infantil Privado

**Aprendiz:** David Esteban Alejo Baracaldo
**Ficha:** 3228973A
**Dominio asignado:** Jardín infantil privado

## Recurso: Child (niño matriculado)

API REST CRUD sobre el mismo recurso `Child` de la semana 1, ahora expuesto vía HTTP con Express 5 en vez de un script CLI. Datos en memoria (sin base de datos aún, eso llega en la semana 5).

- `id`: autoincremental
- `name`: nombre del niño
- `group`: salón/grupo (Sala Cuna, Maternal, Párvulos, Pre-jardín, Jardín, Transición)
- `monthlyFee`: mensualidad
- `active`: matriculado actualmente o retirado

## Endpoints

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/children` | Listar todos los niños | 200 |
| GET | `/api/v1/children/:id` | Obtener un niño por ID | 200 / 404 |
| POST | `/api/v1/children` | Matricular un niño nuevo | 201 |
| PUT | `/api/v1/children/:id` | Actualizar datos de un niño | 200 / 404 |
| DELETE | `/api/v1/children/:id` | Dar de baja a un niño | 204 / 404 |

## Middlewares

Orden: `express.json()` → logger (método, ruta, status, tiempo) → rutas → 404 handler → error handler global (4 parámetros, siempre último).

## Cómo ejecutar

```bash
pnpm install
pnpm dev
```

Servidor en `http://localhost:3000`. Ejemplo de prueba:

```bash
curl -X POST http://localhost:3000/api/v1/children \
  -H "Content-Type: application/json" \
  -d '{"name": "Camilo Restrepo", "group": "Maternal", "monthlyFee": 420000, "active": true}'
```