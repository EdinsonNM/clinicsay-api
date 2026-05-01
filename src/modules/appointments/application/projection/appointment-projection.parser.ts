import { BadRequestException } from '@nestjs/common';

export type IncludeName = 'patient' | 'doctor' | 'doctor.specialty';
export type ResourceName =
  | 'appointments'
  | 'patients'
  | 'doctors'
  | 'specialties';

export interface AppointmentProjection {
  include: Set<IncludeName>;
  fields: Partial<Record<ResourceName, Set<string>>>;
}

const includes = new Set<IncludeName>([
  'patient',
  'doctor',
  'doctor.specialty',
]);
const fields: Record<ResourceName, Set<string>> = {
  appointments: new Set(['date', 'status', 'reason']),
  patients: new Set(['fullName', 'dni', 'email', 'phone', 'address']),
  doctors: new Set(['name', 'cmp']),
  specialties: new Set(['name']),
};

const defaults: Record<ResourceName, string[]> = {
  appointments: ['date', 'status'],
  patients: ['fullName'],
  doctors: ['name'],
  specialties: ['name'],
};

export class AppointmentProjectionParser {
  static parse(query: Record<string, unknown>): AppointmentProjection {
    const include = new Set<IncludeName>();
    const rawInclude = this.asString(query.include);
    if (rawInclude) {
      for (const item of rawInclude.split(',').filter(Boolean)) {
        if (!includes.has(item as IncludeName)) {
          throw new BadRequestException(`include no soportado: ${item}`);
        }
        include.add(item as IncludeName);
      }
    }

    const parsedFields: Partial<Record<ResourceName, Set<string>>> = {};
    for (const resource of Object.keys(fields) as ResourceName[]) {
      const raw = this.fieldValue(query, resource);
      if (!raw) continue;
      parsedFields[resource] = new Set(
        raw
          .split(',')
          .filter(Boolean)
          .map((field) => {
            if (!fields[resource].has(field)) {
              throw new BadRequestException(
                `field no soportado: ${resource}.${field}`,
              );
            }
            return field;
          }),
      );
    }

    for (const key of Object.keys(query)) {
      if (key.startsWith('fields[')) {
        const resource = key.slice(7, -1);
        if (!(resource in fields)) {
          throw new BadRequestException(`resource no soportado: ${resource}`);
        }
      }
    }
    const nestedFields = query.fields;
    if (nestedFields && typeof nestedFields === 'object') {
      for (const resource of Object.keys(nestedFields)) {
        if (!(resource in fields)) {
          throw new BadRequestException(`resource no soportado: ${resource}`);
        }
      }
    }

    if (include.has('doctor.specialty')) include.add('doctor');
    return { include, fields: parsedFields };
  }

  static attributesFor(
    resource: ResourceName,
    projection: AppointmentProjection,
  ) {
    return [...(projection.fields[resource] ?? new Set(defaults[resource]))];
  }

  private static asString(value: unknown): string | undefined {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.join(',');
    return undefined;
  }

  private static fieldValue(
    query: Record<string, unknown>,
    resource: ResourceName,
  ): string | undefined {
    const literal = this.asString(query[`fields[${resource}]`]);
    if (literal) return literal;
    const nested = query.fields;
    if (!nested || typeof nested !== 'object') return undefined;
    return this.asString((nested as Record<string, unknown>)[resource]);
  }
}
