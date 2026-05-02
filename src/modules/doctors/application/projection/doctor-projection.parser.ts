import { BadRequestException } from '@nestjs/common';

export type DoctorIncludeName =
  | 'specialties'
  | 'appointments.upcoming'
  | 'appointments.history';

export type DoctorResourceName =
  | 'doctors'
  | 'specialties'
  | 'appointments'
  | 'patients';

export interface DoctorProjection {
  include: Set<DoctorIncludeName>;
  fields: Partial<Record<DoctorResourceName, Set<string>>>;
}

const detailDefaultIncludes: DoctorIncludeName[] = [
  'specialties',
  'appointments.upcoming',
  'appointments.history',
];

const includesList = new Set<DoctorIncludeName>(['specialties']);

const includesDetail = new Set<DoctorIncludeName>([
  'specialties',
  'appointments.upcoming',
  'appointments.history',
]);

const fields: Record<DoctorResourceName, Set<string>> = {
  doctors: new Set(['name', 'cmp', 'specialtyIds']),
  specialties: new Set(['name']),
  appointments: new Set(['date', 'status', 'reason']),
  patients: new Set(['fullName', 'dni', 'email', 'phone', 'address']),
};

const defaults: Record<DoctorResourceName, string[]> = {
  doctors: ['name', 'cmp'],
  specialties: ['name'],
  appointments: ['date', 'status'],
  patients: ['fullName', 'dni'],
};

export class DoctorProjectionParser {
  static parseListQuery(query: Record<string, unknown>): DoctorProjection {
    return this.parse(query, 'list');
  }

  static parseDetailQuery(query: Record<string, unknown>): DoctorProjection {
    return this.parse(query, 'detail');
  }

  static attributesFor(
    resource: DoctorResourceName,
    projection: DoctorProjection,
  ): string[] {
    return [...(projection.fields[resource] ?? new Set(defaults[resource]))];
  }

  private static parse(
    query: Record<string, unknown>,
    mode: 'list' | 'detail',
  ): DoctorProjection {
    const include = new Set<DoctorIncludeName>();
    const allowIncludes = mode === 'list' ? includesList : includesDetail;
    const hasIncludeKey = Object.prototype.hasOwnProperty.call(query, 'include');

    if (mode === 'detail' && !hasIncludeKey) {
      for (const item of detailDefaultIncludes) include.add(item);
    } else {
      const rawInclude = this.asString(query.include);
      if (rawInclude) {
        for (const item of rawInclude.split(',').filter(Boolean)) {
          if (!allowIncludes.has(item as DoctorIncludeName)) {
            throw new BadRequestException(`include no soportado: ${item}`);
          }
          include.add(item as DoctorIncludeName);
        }
      }
    }

    const parsedFields: Partial<Record<DoctorResourceName, Set<string>>> = {};
    for (const resource of Object.keys(fields) as DoctorResourceName[]) {
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

    return { include, fields: parsedFields };
  }

  private static asString(value: unknown): string | undefined {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.join(',');
    return undefined;
  }

  private static fieldValue(
    query: Record<string, unknown>,
    resource: DoctorResourceName,
  ): string | undefined {
    const literal = this.asString(query[`fields[${resource}]`]);
    if (literal) return literal;
    const nested = query.fields;
    if (!nested || typeof nested !== 'object') return undefined;
    return this.asString((nested as Record<string, unknown>)[resource]);
  }
}
