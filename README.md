# Jardín Infantil — Bootcamp bc-expressjs

Repositorio personal de seguimiento del bootcamp **bc-expressjs** (SENA - Tecnología en Análisis y Desarrollo de Software). Cada semana se implementa un ejercicio y un proyecto aplicados a un mismo dominio de negocio, evolucionando en complejidad: de un script en Node.js puro hasta una API REST completa con Express, TypeScript, validación, manejo de errores y persistencia en base de datos.

## Autor

| Campo | Detalle |
|---|---|
| Nombre | David Esteban Alejo Baracaldo |
| Ficha | 3228973A |
| Programa | Tecnología en Análisis y Desarrollo de Software (ADSO) |
| Dominio asignado | Jardín infantil privado |
| Recurso principal | `Child` (Niño/a) |

## Sobre el dominio

El sistema modela la operación de un jardín infantil privado. El dominio completo contempla cuatro entidades: **niños**, **padres/acudientes**, **personal (staff)** y **actividades**. El desarrollo se enfoca primero en la entidad `Child`, que representa a cada niño matriculado, y se irá extendiendo a las demás entidades conforme el bootcamp introduzca relaciones y persistencia (semana 05 en adelante, con PostgreSQL y Prisma).

### Entidad `Child`

| Campo | Tipo | Descripción | Obligatorio |
|---|---|---|---|
| id | number | Identificador único del niño | Sí |
| name | string | Nombre completo | Sí |
| group | string | Grupo/sala (Sala Cuna, Maternal, Párvulos, Pre-jardín, Jardín, Transición) | Sí |
| monthlyFee | number | Valor de la mensualidad | Sí |
| active | boolean | Estado de matrícula (activo/inactivo) | Sí |
| createdAt | Date | Fecha de registro | No |

## Arquitectura

Desde la semana 03, la API sigue una arquitectura en 4 capas:

| Capa | Responsabilidad |
|---|---|
| Routes | Define los endpoints de la API |
| Controllers | Maneja las peticiones y respuestas HTTP |
| Services | Contiene la lógica de negocio y validaciones |
| Repositories | Accede a los datos (almacenamiento en memoria por ahora) |

**Tecnologías:** Node.js 22 · TypeScript 5 (strict) · Express 5 · pnpm 10 · Zod v4 (validación) · Winston + Morgan (logging)

### Endpoints implementados (API de niños — semana 04)

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
| 404 Not Found | Recurso no encontrado | Niño no existe o ruta incorrecta |
| 500 Internal Server Error | Error interno | Fallo inesperado en el servidor |

## Progreso semanal

| Semana | Contenido | Carpeta |
|---|---|---|
| 01 | Fundamentos de Node.js — CLI que lee `children.json`, genera resumen y filtra por grupo | `bootcamp/week-01-nodejs_fundamentals/3-proyecto` |
| 02 | Introducción a Express — API CRUD en memoria para niños | `bootcamp/week-02-express_intro/3-proyecto` |
| 03 | Arquitectura REST en capas (Routes → Controllers → Services → Repositories) + paginación | `bootcamp/week-03-rest_api_arquitectura/3-proyecto` |
| 04 | Validación con Zod, manejo de errores (`AppError`) y logging (Winston/Morgan) | `bootcamp/week-04-validacion_error_handling/3-proyecto` |
| 05 | PostgreSQL + Prisma (en curso) | `bootcamp/week-05-postgresql_prisma` |

Cada carpeta de semana contiene su propio `README.md` con el detalle de esa entrega.

## Cómo ejecutar cada proyecto

Cada semana tiene su propio `package.json` dentro de `3-proyecto/starter`. Para correr la versión más reciente (semana 04):

\`\`\`bash
cd bootcamp/week-04-validacion_error_handling/3-proyecto/starter
pnpm install
pnpm dev
\`\`\`

Para compilar y correr en modo producción:

\`\`\`bash
pnpm build
pnpm start
