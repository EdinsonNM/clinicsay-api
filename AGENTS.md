# Guía De Agentes API

## Alcance

Este proyecto posee el backend NestJS, integración Prisma, contratos API, Swagger/OpenAPI y tests backend.
Debe poder operar como entrega autocontenida desde `apps/api`, sin depender de `apps/web`.

## Reglas De Arquitectura

- Mantener visibles los límites DDD:
  - `domain`: entidades, value objects, reglas de negocio.
  - `application`: casos de uso, ports, parsing de proyección.
  - `infrastructure`: repositorios Prisma, mappers.
  - `interfaces/http`: controllers, DTOs, decoradores Swagger.
- La capa application depende de ports, no de Prisma directamente.
- Los controllers no deben devolver modelos Prisma crudos.
- PostgreSQL es la base de datos oficial del reto.
- Prisma de la entrega independiente vive en `apps/api/prisma`.
- El flujo admin debe soportar login dummy, calendario, creación de citas, pacientes, especialidades y doctores por especialidad.
- Doctor y Specialty tienen relación many-to-many.

## Reglas De Proyección

- Validar `include` y `fields` mediante allowlists.
- La proyección por defecto debe ser segura para privacidad.
- `email`, `phone` y `address` del paciente no deben filtrarse.
- Agregar tests para cada cambio de comportamiento de proyección.

## Comandos

- Desde la raíz: `pnpm --filter api start:dev`
- Desde `apps/api`: `pnpm start:dev`
- Desde `apps/api`: `pnpm test`
- Desde `apps/api`: `pnpm test:coverage`
- Desde `apps/api`: `pnpm prisma:migrate`
- Desde `apps/api`: `pnpm prisma:seed`
- Desde `apps/api`: `pnpm swagger:export`
- Desde `apps/api`: `docker compose config`
