# Jardín Infantil — Bootcamp bc-expressjs

Repositorio personal de seguimiento del bootcamp **bc-expressjs** (SENA - Tecnología en Análisis y Desarrollo de Software). Cada semana se implementa un ejercicio y un proyecto aplicados a un mismo dominio de negocio, evolucionando en complejidad: de un script en Node.js puro hasta una API REST completa con Express, TypeScript, validación, manejo de errores, persistencia en base de datos y autenticación.

## Autor

| Campo | Detalle |
|---|---|
| Nombre | David Esteban Alejo Baracaldo |
| Ficha | 3228973A |
| Programa | Tecnología en Análisis y Desarrollo de Software (ADSO) |
| Dominio asignado | Jardín infantil privado |
| Recurso principal | `Child` (Niño/a) |

## Sobre el dominio

El sistema modela la operación de un jardín infantil privado. El dominio completo contempla cuatro entidades: **niños**, **padres/acudientes**, **personal (staff)** y **actividades**. El desarrollo se enfoca primero en la entidad `Child`, que representa a cada niño matriculado, y se irá extendiendo a las demás entidades conforme el bootcamp introduzca relaciones, persistencia y autenticación.

### Entidad `Child`

| Campo | Tipo | Descripción | Obligatorio |
|---|---|---|---|
| id | number | Identificador único del niño | Sí |
| name | string | Nombre completo | Sí |
| group | string | Grupo/sala (Sala Cuna, Maternal, Párvulos, Pre-jardín, Jardín, Transición) | Sí |
| monthlyFee | number | Valor de la mensualidad | Sí |
| active | boolean | Estado de matrícula (activo/inactivo) | Sí |
| enrollmentCode | string | Código de matrícula (único, formato PREFIJO-AÑO-CORRELATIVO) | Sí |
| birthDate | Date | Fecha de nacimiento | Sí |
| parentId | number | Referencia al acudiente (`Parent`) | No |
| createdBy | ObjectId | Referencia al `User` (staff) que lo registró — desde la semana 07 | No |
| createdAt | Date | Fecha de registro | No |

### Roles del personal (`User`) — desde la semana 08

| Rol | Descripción |
|---|---|
| `staff` | Educadora/profesor. Puede crear niños y editar únicamente los que registró. |
| `admin` | Director/a del jardín. Acceso total, incluida la eliminación de registros. |

## Arquitectura

Desde la semana 03, la API sigue una arquitectura en 4 capas:

| Capa | Responsabilidad |
|---|---|
| Routes | Define los endpoints de la API |
| Controllers | Maneja las peticiones y respuestas HTTP |
| Services | Contiene la lógica de negocio y validaciones |
| Repositories | Accede a los datos (Prisma ORM + PostgreSQL desde la semana 05; Mongoose + MongoDB desde la semana 06) |

Desde la semana 07, las rutas de niños están protegidas con autenticación JWT (access + refresh token con rotación, cookies HttpOnly). Desde la semana 08, se suma una capa de autorización por roles (RBAC) y seguridad HTTP: Helmet, rate limiting, CORS con whitelist y sanitización contra NoSQL injection. Desde la semana 09, cada proyecto cuenta con una suite de pruebas automatizadas (Jest + Supertest) que cubre la lógica de negocio en aislamiento y los endpoints end-to-end contra una base de datos en memoria.

**Tecnologías:** Node.js 22 · TypeScript 5 (strict) · Express 5 · pnpm 10 · Zod v4 (validación) · Winston + Morgan (logging) · PostgreSQL + Prisma (semana 05) · MongoDB + Mongoose (semana 06) · JWT + bcrypt (semana 07) · RBAC + Helmet + CORS + rate limiting (semana 08) · Jest + Supertest + mongodb-memory-server (semana 09)

### Endpoints implementados (API de niños)

| Método | Endpoint | Descripción | Código de éxito |
|---|---|---|---|
| GET | /api/v1/children | Lista paginada de niños | 200 OK |
| GET | /api/v1/children/:id | Obtiene un niño por su ID | 200 OK |
| POST | /api/v1/children | Registra un nuevo niño (validado con Zod) | 201 Created |
| PUT | /api/v1/children/:id | Actualiza los datos de un niño | 200 OK |
| DELETE | /api/v1/children/:id | Elimina un niño del sistema | 204 No Content |

### Códigos de error implementados

| Código | Descripción | Escenario |
|---|---|---|
| 400 Bad Request | Validación fallida (Zod) | Campos obligatorios faltantes o con formato inválido |
| 401 Unauthorized | No autenticado | Token ausente, inválido o expirado (desde la semana 07) |
| 403 Forbidden | No autorizado | Rol insuficiente, o intento de editar/eliminar un recurso ajeno (desde la semana 08) |
| 404 Not Found | Recurso no encontrado | Niño no existe o ruta incorrecta |
| 409 Conflict | Campo único duplicado | `enrollmentCode` o `email` ya existen (Prisma P2002 / MongoDB 11000) |
| 429 Too Many Requests | Rate limit excedido | Más de 100 req/15min globales, o más de 5 intentos/15min en login/registro |
| 500 Internal Server Error | Error interno | Fallo inesperado en el servidor |

## Progreso semanal

| Semana | Contenido | Carpeta |
|---|---|---|
| 01 | Fundamentos de Node.js — CLI que lee `children.json`, genera resumen y filtra por grupo | `bootcamp/week-01-nodejs_fundamentals/3-proyecto`|
| 02 | Introducción a Express — API CRUD en memoria para niños | `bootcamp/week-02-express_intro/3-proyecto` |
| 03 | Arquitectura REST en capas (Routes → Controllers → Services → Repositories) + paginación | `bootcamp/week-03-rest_api_arquitectura/3-proyecto` |
| 04 | Validación con Zod, manejo de errores (`AppError`) y logging (Winston/Morgan) | `bootcamp/week-04-validacion_error_handling/3-proyecto` |
| 05 | PostgreSQL + Prisma — persistencia real con `Child` y `Parent` (relación 1:N) | `bootcamp/week-05-postgresql_prisma/3-proyecto` |
| 06 | MongoDB + Mongoose — mismo dominio `Child`/`Parent` sobre una base de datos NoSQL, con `populate` para las relaciones | `bootcamp/week-06-mongodb_mongoose/3-proyecto` |
| 07 | Autenticación JWT — registro/login con bcrypt, access + refresh token con rotación, rutas de `Child` protegidas | `bootcamp/week-07-autenticacion_jwt/3-proyecto` |
| 08 | Autorización y Seguridad — RBAC (`requireRole`), Helmet, rate limiting, CORS con whitelist, sanitización NoSQL | `bootcamp/week-08-autorizacion_seguridad/3-proyecto` |
| 09 | Testing — Jest + Supertest: pruebas unitarias (servicios, middlewares) y de integración (rutas end-to-end con `mongodb-memory-server`), cobertura ≥90% stmts / ≥90% branch | `bootcamp/week-09-testing/3-proyecto` |

Cada carpeta de semana contiene su propio `README.md` con el detalle de esa entrega.

> **Nota sobre el historial de commits:** las semanas 01 a 04 quedaron agrupadas
> en el commit inicial del repositorio (`Initial commit - Proyecto Jardín
> Infantil`), antes de adoptar la convención de un commit `Semana 0X` por
> entrega. El código de esas 4 semanas está completo y funcional — solo no
> quedó separado por commit individual. A partir de la semana 05, cada semana
> tiene su propio commit `Semana 0X`.

## Cómo ejecutar cada proyecto

Cada semana tiene su propio `package.json` dentro de `3-proyecto/starter`. Para correr la versión más reciente (semana 08, requiere Docker):

```bash
cd bootcamp/week-08-autorizacion_seguridad/3-proyecto/starter
cp .env.example .env
# Generar dos secretos DISTINTOS y pegarlos en .env:
openssl rand -base64 64   # JWT_ACCESS_SECRET
openssl rand -base64 64   # JWT_REFRESH_SECRET
docker compose up -d
pnpm install
pnpm approve-builds
pnpm dev
```

Para compilar y correr en modo producción:

```bash
pnpm build
pnpm start
```

## Cómo correr las pruebas (semana 09)

La suite de tests no requiere Docker ni variables de entorno: usa
`mongodb-memory-server` para levantar una base MongoDB en memoria en cada
corrida.

```bash
cd bootcamp/week-09-testing/3-proyecto/starter
pnpm install
pnpm test              # correr toda la suite
pnpm test:coverage     # correr con reporte de cobertura
```
