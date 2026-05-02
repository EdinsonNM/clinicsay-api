import { BadRequestException } from '@nestjs/common';
import {
  DoctorProjection,
  DoctorProjectionParser,
} from '../projection/doctor-projection.parser';

export interface ListDoctorsQuery {
  specialtyId?: string;
  projection: DoctorProjection;
}

const identifierPattern = /^[A-Za-z0-9_-]+$/;

export class ListDoctorsQueryParser {
  static parse(query: Record<string, unknown>): ListDoctorsQuery {
    const specialtyId = this.optionalIdentifier(query.specialtyId, 'specialtyId');
    return {
      specialtyId,
      projection: DoctorProjectionParser.parseListQuery(query),
    };
  }

  private static optionalIdentifier(value: unknown, name: string) {
    const normalized = this.asString(value);
    if (!normalized) return undefined;
    if (!identifierPattern.test(normalized)) {
      throw new BadRequestException(`${name} tiene formato invalido`);
    }
    return normalized;
  }

  private static asString(value: unknown): string | undefined {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.join(',');
    return undefined;
  }
}
