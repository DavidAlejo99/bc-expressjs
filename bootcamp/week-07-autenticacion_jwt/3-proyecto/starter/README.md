# Proyecto Semana 07 — Autenticación JWT

API REST para la gestión de niños de un jardín infantil privado, protegida con autenticación JWT (access + refresh token con rotación), usando cookies HttpOnly.

## Modelo de datos

### User (personal del jardín)

| Campo    | Tipo     | Descripción                              |
|----------|----------|--------------------------------------------|
| `_id`    | ObjectId | Identificador generado por MongoDB        |
| `email`  | String   | Correo único, en minúsculas               |
| `password` | String | Hash bcrypt (nunca se devuelve en queries) |
| `name`   | String   | Nombre completo                            |
| `role`   | String   | `user` o `admin`                           |
| `refreshToken` | String | Hash (SHA-256 + bcrypt) del refresh token vigente |

### Child

| Campo            | Tipo     | Descripción                                             |
|------------------|----------|------------------------------------------------------------|
| `_id`            | ObjectId | Identificador generado por MongoDB                        |
| `name`           | String   | Nombre del niño                                            |
| `enrollmentCode` | String   | Código único de matrícula                                  |
| `group`          | String   | Grupo/sala                                                 |
| `monthlyFee`     | Number   | Valor de la mensualidad                                    |
| `active`         | Boolean  | Si el niño está actualmente matriculado                    |
| `birthDate`      | Date     | Fecha de nacimiento                                        |
| `createdBy`      | ObjectId | Referencia al `User` (staff) que registró al niño          |

## Cómo correr el proyecto

```bash
docker compose up -d
cp .env.example .env
# Generar dos secretos DISTINTOS y pegarlos en .env:
openssl rand -base64 64   # JWT_ACCESS_SECRET
openssl rand -base64 64   # JWT_REFRESH_SECRET
pnpm install
pnpm approve-builds   # aprobar el build nativo de bcrypt
pnpm dev
```

## Endpoints

### Autenticación (`/api/v1/auth`)

| Método | Ruta       | Auth | Descripción                                    |
|--------|------------|------|--------------------------------------------------|
| POST   | /register  | No   | Crea un usuario (staff)                          |
| POST   | /login     | No   | Inicia sesión, entrega cookies `accessToken`/`refreshToken` |
| POST   | /refresh   | No (usa cookie) | Rota los tokens usando el refresh token vigente |
| GET    | /me        | Sí   | Datos del usuario autenticado                    |
| POST   | /logout    | Sí   | Invalida el refresh token del usuario            |

### Niños (`/api/v1/children`) — todas requieren autenticación

| Método | Ruta            | Descripción                     |
|--------|-----------------|----------------------------------|
| GET    | /                | Lista todos los niños           |
| GET    | /:id             | Obtiene un niño por id          |
| POST   | /                | Crea un niño (guarda `createdBy`) |
| PATCH  | /:id             | Actualiza un niño               |
| DELETE | /:id             | Elimina un niño                 |

## Seguridad de los tokens

- **Access token** (15 min): firmado con `JWT_ACCESS_SECRET`, viaja en cookie `accessToken` (`path=/`, `httpOnly`).
- **Refresh token** (7 días): firmado con `JWT_REFRESH_SECRET` (secreto distinto al del access token), viaja en cookie `refreshToken` (`path=/api/v1/auth`, `httpOnly`).
- El refresh token nunca se guarda en texto plano: se aplica `SHA-256` seguido de `bcrypt` antes de persistirlo. El pre-hash con SHA-256 es necesario porque bcrypt trunca su entrada a 72 bytes — sin él, dos refresh tokens del mismo usuario emitidos en momentos distintos podrian no distinguirse en la comparacion, permitiendo reutilizar un token ya rotado.
- Cada `/refresh` rota ambos tokens y reemplaza el hash guardado, invalidando el token anterior.
- `/logout` borra el hash del refresh token en la base de datos y limpia las cookies.

## Manejo de errores

- `ZodError` → 400, con detalle por campo.
- Credenciales inválidas / token ausente o expirado → 401.
- Recurso no encontrado → 404.
- Email o `enrollmentCode` duplicado → 409.
- Cualquier otro error → 500.
