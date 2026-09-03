# Proyecto Semana 06 — MongoDB + Mongoose

API REST para la gestión de niños y acudientes de un jardín infantil privado, usando MongoDB como base de datos y Mongoose como ODM.

## Modelo de datos

### Child

| Campo          | Tipo      | Descripción                                              |
|----------------|-----------|-----------------------------------------------------------|
| `_id`          | ObjectId  | Identificador generado por MongoDB                        |
| `name`         | String    | Nombre del niño (letras Unicode, tildes, espacios)         |
| `enrollmentCode` | String  | Código único de matrícula (formato `PREFIJO-AÑO-CORRELATIVO`) |
| `group`        | String    | Grupo/sala: Sala Cuna, Maternal, Párvulos, Pre-jardín, Jardín, Transición |
| `monthlyFee`   | Number    | Valor de la mensualidad                                    |
| `active`       | Boolean   | Si el niño está actualmente matriculado                    |
| `birthDate`    | Date      | Fecha de nacimiento                                        |
| `parent`       | ObjectId  | Referencia al acudiente (`Parent`)                          |
| `createdAt` / `updatedAt` | Date | Timestamps automáticos de Mongoose                  |

### Parent

| Campo       | Tipo     | Descripción                          |
|-------------|----------|----------------------------------------|
| `_id`       | ObjectId | Identificador generado por MongoDB     |
| `fullName`  | String   | Nombre completo del acudiente          |
| `email`     | String   | Correo único, en minúsculas            |
| `phone`     | String   | Teléfono de contacto (7 a 10 dígitos)  |
| `createdAt` / `updatedAt` | Date | Timestamps automáticos de Mongoose |

## Cómo correr el proyecto

```bash
docker compose up -d
cp .env.example .env
pnpm install
pnpm run seed
pnpm dev
```

> Si tienes un MongoDB instalado localmente (por ejemplo vía Homebrew), asegúrate de que no esté escuchando también en el puerto 27017: `brew services stop mongodb-community`.

## Endpoints

| Método | Ruta                        | Descripción                          |
|--------|-----------------------------|---------------------------------------|
| GET    | `/api/v1/children`          | Lista niños (paginado, filtro `search`) |
| GET    | `/api/v1/children/:id`      | Obtiene un niño por id                |
| POST   | `/api/v1/children`          | Crea un niño                          |
| PUT    | `/api/v1/children/:id`      | Actualiza un niño                     |
| DELETE | `/api/v1/children/:id`      | Elimina un niño                       |
| GET    | `/api/v1/parents`           | Lista acudientes                      |
| GET    | `/api/v1/parents/:id`       | Obtiene un acudiente por id           |
| POST   | `/api/v1/parents`           | Crea un acudiente                     |
| PUT    | `/api/v1/parents/:id`       | Actualiza un acudiente                |
| DELETE | `/api/v1/parents/:id`       | Elimina un acudiente                  |

## Validación

Validación con Zod, incluyendo los patrones recomendados por el instructor (regex ancladas y acotadas para evitar ReDoS):

- `name` / `fullName`: `^\p{L}[\p{L}\p{M}'\- ]{1,59}$` con flag `u` (soporta tildes y ñ).
- `enrollmentCode`: `^[A-Z]{2,4}-\d{4}-\d{3,6}$`.
- `phone`: `^\d{7,10}$`.
- `email`: `z.string().email()`.

## Manejo de errores

- `ZodError` → 400, con el detalle de cada campo inválido.
- `mongoose.Error.CastError` (id con formato inválido) → 400.
- Error de duplicado de Mongo (código 11000) → 409.
- Registro no encontrado → 404.
- Cualquier otro error → 500.
