# ClinicSay API

API NestJS del reto ClinicSay. Esta entrega es autocontenida para poder vivir como repositorio Git independiente: incluye Prisma, migraciones, seed, Dockerfile, Docker Compose, variables propias y comandos de validacion.

## Requisitos

- Node.js 22 o compatible
- pnpm 9.15.4
- Docker Desktop o Docker Engine

## Variables

| Variable | Requerida | Proposito | Ejemplo |
| --- | --- | --- | --- |
| `DB_URL` | Si | Conexion PostgreSQL usada por Prisma | `postgresql://clinicsay:clinicsay@localhost:5432/clinicsay` |
| `PORT` | Si | Puerto HTTP de NestJS | `3000` |
| `NODE_ENV` | No | Modo de ejecucion | `development` |

## Instalacion

```bash
pnpm install
cp .env.example .env
```

## Base De Datos Y Prisma

```bash
docker compose up -d db
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

Prisma vive en `prisma/` dentro de esta entrega. El cliente se genera en `src/generated/prisma`.

## Desarrollo

```bash
pnpm start:dev
```

URLs esperadas:

- API: `http://localhost:3000/api/v1`
- Swagger UI: `http://localhost:3000/api/docs`
- OpenAPI JSON: `http://localhost:3000/api/docs-json`

## Validacion

```bash
pnpm build
pnpm test
pnpm test:cov
pnpm test:e2e
pnpm lint
pnpm swagger:export
docker compose config
```

Coverage esperado:

```text
coverage/lcov.info
```

## Docker

```bash
docker compose up --build
```

Servicios:

- `db`: PostgreSQL 16 en `localhost:5432`
- `api`: NestJS en `localhost:3000`

El contenedor API ejecuta migraciones y seed antes de iniciar la app para facilitar la revision local del reto.

## Contrato Y Privacidad

La API mantiene el contrato del flujo de citas:

- Login dummy de administrador.
- Calendario por rango.
- Creacion de cita con paciente existente o nuevo.
- Catalogos de pacientes, especialidades y doctores por especialidad.
- Detalle de cita con `include` y `fields[resource]`.

Los campos privados de paciente (`email`, `phone`, `address`) no se exponen por defecto ni por sparse fieldsets no permitidos.

## Troubleshooting

- Si Prisma no encuentra el schema, ejecutar desde `apps/api` y verificar `prisma/schema.prisma`.
- Si la API no conecta a la base, revisar `DB_URL` y que `docker compose up -d db` este activo.
- Si `swagger:export` falla, ejecutar primero `pnpm prisma:generate`.
