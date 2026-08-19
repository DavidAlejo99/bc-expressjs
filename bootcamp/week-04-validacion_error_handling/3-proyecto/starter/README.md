# Proyecto Semana 4 — Validación, Errores y Logging: Jardín Infantil Privado

**Aprendiz:** David Esteban Alejo Baracaldo
**Ficha:** 3228973A
**Dominio asignado:** Jardín infantil privado

## Recurso: Child (niño matriculado)

Misma API de las semanas 2 y 3, ahora con validación robusta, errores estructurados y logging profesional.

- `name`: nombre del niño (requerido, mínimo 1 carácter)
- `group`: salón/grupo, validado contra un enum fijo (Sala Cuna, Maternal, Párvulos, Pre-jardín, Jardín, Transición)
- `monthlyFee`: mensualidad, número positivo requerido
- `active`: matriculado o retirado, booleano con default `true`

## Validación (Zod)

`createChildSchema` valida los 4 campos con mensajes de error personalizados. `updateChildSchema` reutiliza el anterior con `.partial()` para permitir actualizaciones parciales. El parámetro `:id` de la URL se valida por separado con `z.coerce.number().int().positive()`.

## Manejo de errores

- `AppError`: clase para errores operacionales (404 cuando el niño no existe)
- `notFound`: middleware que captura rutas no registradas y las convierte en `AppError(404, ...)`
- `errorHandler`: middleware de 4 parámetros que distingue `ZodError` (400 con detalle de campos), `AppError` (su propio status code) y errores genéricos (500)

## Logging (Winston + Morgan)

Winston loguea con nivel `http` en desarrollo (colorizado en consola) y `warn` en producción (JSON + archivo `logs/error.log`). Morgan registra cada petición HTTP a través del stream de Winston. Los errores operacionales (`AppError`) se registran con `logger.warn`; los errores inesperados con `logger.error`.

## Endpoints

| Método | Ruta | Status | Descripción |
|--------|------|--------|-------------|
| GET | `/api/v1/children?page=&limit=` | 200 | Listar paginado |
| GET | `/api/v1/children/:id` | 200 / 404 / 400 | Obtener por ID |
| POST | `/api/v1/children` | 201 / 400 | Matricular niño nuevo |
| PUT | `/api/v1/children/:id` | 200 / 404 / 400 | Actualizar datos |
| DELETE | `/api/v1/children/:id` | 204 / 404 / 400 | Dar de baja |

## Cómo ejecutar

```bash
pnpm install
pnpm dev
```