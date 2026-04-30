# Guía De Agentes API

## Alcance

Este proyecto posee el backend NestJS, integración Prisma, contratos API, Swagger/OpenAPI y tests backend.

## Reglas De Arquitectura

- Mantener visibles los límites DDD:
  - `domain`: entidades, value objects, reglas de negocio.
  - `application`: casos de uso, ports, parsing de proyección.
  - `infrastructure`: repositorios Prisma, mappers.
  - `interfaces/http`: controllers, DTOs, decoradores Swagger.
- La capa application depende de ports, no de Prisma directamente.
- Los controllers no deben devolver modelos Prisma crudos.
- PostgreSQL es la base de datos oficial del reto.
- El flujo admin debe soportar login dummy, calendario, creación de citas, pacientes, especialidades y doctores por especialidad.
- Doctor y Specialty tienen relación many-to-many.

## Reglas De Proyección

- Validar `include` y `fields` mediante allowlists.
- La proyección por defecto debe ser segura para privacidad.
- `email`, `phone` y `address` del paciente no deben filtrarse.
- Agregar tests para cada cambio de comportamiento de proyección.

## Comandos

- `pnpm --filter api dev`
- `pnpm --filter api test`
- `pnpm --filter api test:coverage`
- `pnpm --filter api prisma:migrate`
- `pnpm --filter api prisma:seed`
- `pnpm --filter api swagger:export`
