# Proyecto Semana 05 — PostgreSQL + Prisma (Jardín Infantil)

API REST para la gestión de niños y acudientes de un jardín infantil privado, ahora persistida en PostgreSQL mediante Prisma ORM (antes en memoria).

**Dominio:** Jardín infantil privado
**Recursos:** `Child` (niño, recurso principal) y `Parent` (acudiente, recurso secundario)
**Relación:** Un `Parent` puede tener varios `Child` (1:N)

## Modelo de datos

### Child

| Campo | Tipo | Descripción |
|---|---|---|
| id | Int | Identificador único (autoincremental) |
| name | String | Nombre completo del niño |
| enrollmentCode | String (único) | Código de matrícula, formato PREFIJO-AÑO-CORRELATIVO (ej. JI-2026-001) |
| group | String | Grupo/sala (Sala Cuna, Maternal, Párvulos, Pre-jardín, Jardín, Transición) |
| monthlyFee | Float | Valor de la mensualidad |
| active | Boolean | Estado de matrícula |
| birthDate | DateTime | Fecha de nacimiento |
| parentId | Int? | Referencia al acudiente |
| createdAt / updatedAt | DateTime | Timestamps |

### Parent

| Campo | Tipo | Descripción |
|---|---|---|
| id | Int | Identificador único |
| fullName | String | Nombre completo del acudiente |
| email | String (único) | Correo de contacto |
| phone | String | Teléfono de contacto |
| createdAt / updatedAt | DateTime | Timestamps |

## Cómo correr el proyecto

```bash
cp .env.example .env
docker compose up -d
pnpm install
pnpm prisma migrate dev --name init
pnpm prisma db seed
pnpm dev
```

## Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| GET | /api/v1/children | Lista paginada de niños (incluye acudiente) |
| GET | /api/v1/children/:id | Detalle de un niño |
| POST | /api/v1/children | Crea un niño |
| PUT | /api/v1/children/:id | Actualiza un niño |
| DELETE | /api/v1/children/:id | Elimina un niño |
| GET | /api/v1/parents | Lista de acudientes (incluye sus niños) |
| GET/POST/PUT/DELETE | /api/v1/parents/:id | CRUD de acudientes |

## Validación

Los campos `name`, `fullName` y `enrollmentCode` usan expresiones regulares ancladas (`^...$`) con Zod para rechazar formatos inválidos: nombres solo aceptan letras (incluyendo tildes y "ñ" vía Unicode `\p{L}`), y `enrollmentCode` exige el formato `PREFIJO-AÑO-CORRELATIVO`.

## Manejo de errores

- 400: validación fallida (Zod)
- 404: recurso no encontrado (`AppError` o Prisma `P2025`)
- 409: violación de campo único (Prisma `P2002`, ej. `enrollmentCode` o `email` duplicado)
- 500: error interno inesperado
