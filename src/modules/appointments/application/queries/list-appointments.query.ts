import { BadRequestException } from '@nestjs/common';
import {
  AppointmentProjection,
  AppointmentProjectionParser,
} from '../projection/appointment-projection.parser';

export interface AppointmentListFilters {
  from: Date;
  to: Date;
  doctorId?: string;
  patientId?: string;
  specialtyId?: string;
}

export interface ListAppointmentsQuery {
  filters: AppointmentListFilters;
  projection: AppointmentProjection;
}

const identifierPattern = /^[A-Za-z0-9_-]+$/;
const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

export class ListAppointmentsQueryParser {
  static parse(query: Record<string, unknown>): ListAppointmentsQuery {
    const date = this.asString(query.date);
    const from = this.asString(query.from);
    const to = this.asString(query.to);

    if (date && (from || to)) {
      throw new BadRequestException(
        'Use date para dia unico o from/to para rango, no ambos',
      );
    }
    if (!date && ((from && !to) || (!from && to))) {
      throw new BadRequestException('Debe enviar from y to juntos');
    }

    const range = date
      ? this.dayRange(date)
      : from && to
        ? this.range(from, to)
        : {
            from: new Date('1970-01-01T00:00:00.000Z'),
            to: new Date('9999-12-31T23:59:59.999Z'),
          };

    const filters: AppointmentListFilters = {
      from: range.from,
      to: range.to,
      doctorId: this.optionalIdentifier(query.doctorId, 'doctorId'),
      patientId: this.optionalIdentifier(query.patientId, 'patientId'),
      specialtyId: this.optionalIdentifier(query.specialtyId, 'specialtyId'),
    };

    return {
      filters,
      projection: AppointmentProjectionParser.parse(query),
    };
  }

  private static range(from: string, to: string) {
    const start = this.startOfDay(from, 'from');
    const end = this.endOfDay(to, 'to');
    if (start > end) {
      throw new BadRequestException('Rango de fechas invalido: from > to');
    }
    return { from: start, to: end };
  }

  private static dayRange(date: string) {
    return {
      from: this.startOfDay(date, 'date'),
      to: this.endOfDay(date, 'date'),
    };
  }

  private static startOfDay(value: string, name: string) {
    this.ensureDateOnly(value, name);
    return new Date(`${value}T00:00:00.000Z`);
  }

  private static endOfDay(value: string, name: string) {
    this.ensureDateOnly(value, name);
    return new Date(`${value}T23:59:59.999Z`);
  }

  private static ensureDateOnly(value: string, name: string) {
    if (!dateOnlyPattern.test(value)) {
      throw new BadRequestException(`${name} debe tener formato YYYY-MM-DD`);
    }
    const parsed = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(`${name} tiene una fecha invalida`);
    }
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
