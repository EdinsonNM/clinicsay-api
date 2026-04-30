import { AppointmentDetailRecord } from '../../application/ports/appointment-read.repository';
import {
  AppointmentProjection,
  AppointmentProjectionParser,
} from '../../application/projection/appointment-projection.parser';

type Resource = {
  type: string;
  id: string;
  attributes: Record<string, unknown>;
  relationships?: Record<string, { data: { type: string; id: string } }>;
};

export class AppointmentJsonApiMapper {
  static detail(
    record: AppointmentDetailRecord,
    projection: AppointmentProjection,
  ) {
    const appointmentAttributes = this.pick(
      record.appointment,
      AppointmentProjectionParser.attributesFor('appointments', projection),
    );
    const data: Resource = {
      type: 'appointments',
      id: record.appointment.id,
      attributes: appointmentAttributes,
      relationships: {
        patient: { data: { type: 'patients', id: record.patient.id } },
        doctor: { data: { type: 'doctors', id: record.doctor.id } },
      },
    };

    const included: Resource[] = [];
    if (projection.include.has('patient')) {
      included.push({
        type: 'patients',
        id: record.patient.id,
        attributes: this.pick(
          record.patient,
          AppointmentProjectionParser.attributesFor('patients', projection),
        ),
      });
    }
    if (projection.include.has('doctor')) {
      const doctor: Resource = {
        type: 'doctors',
        id: record.doctor.id,
        attributes: this.pick(
          record.doctor,
          AppointmentProjectionParser.attributesFor('doctors', projection),
        ),
      };
      if (projection.include.has('doctor.specialty')) {
        doctor.relationships = {
          specialty: { data: { type: 'specialties', id: record.specialty.id } },
        };
      }
      included.push(doctor);
    }
    if (projection.include.has('doctor.specialty')) {
      included.push({
        type: 'specialties',
        id: record.specialty.id,
        attributes: this.pick(
          record.specialty,
          AppointmentProjectionParser.attributesFor('specialties', projection),
        ),
      });
    }

    return included.length > 0 ? { data, included } : { data };
  }

  static calendar(records: AppointmentDetailRecord[]) {
    return {
      data: records.map(
        (record) =>
          this.detail(record, { include: new Set(), fields: {} }).data,
      ),
    };
  }

  private static pick(source: object, allowed: string[]) {
    const record = source as Record<string, unknown>;
    return Object.fromEntries(allowed.map((field) => [field, record[field]]));
  }
}
