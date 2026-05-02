import type {
  DoctorAppointmentReadRow,
  DoctorDetailRow,
  DoctorListRow,
} from '../../application/ports/doctor-read.repository';
import {
  DoctorProjection,
  DoctorProjectionParser,
} from '../../application/projection/doctor-projection.parser';

type Resource = {
  type: string;
  id: string;
  attributes: Record<string, unknown>;
  relationships?: Record<
    string,
    | { data: { type: string; id: string } }
    | { data: Array<{ type: string; id: string }> }
  >;
};

export class DoctorJsonApiMapper {
  static list(rows: DoctorListRow[], projection: DoctorProjection) {
    const included = new Map<string, Resource>();
    const data = rows.map((row) => {
      if (projection.include.has('specialties')) {
        for (const spec of row.specialtyRecords) {
          included.set(`specialties:${spec.id}`, {
            type: 'specialties',
            id: spec.id,
            attributes: this.pick(
              spec as unknown as Record<string, unknown>,
              DoctorProjectionParser.attributesFor('specialties', projection),
            ),
          });
        }
      }
      return this.doctorListResource(row, projection);
    });

    return included.size > 0
      ? { data, included: [...included.values()] }
      : { data };
  }

  static detail(record: DoctorDetailRow, projection: DoctorProjection) {
    const included = new Map<string, Resource>();
    const relationships: NonNullable<Resource['relationships']> = {};

    if (projection.include.has('specialties')) {
      relationships.specialties = {
        data: record.specialtyRecords.map((s) => ({
          type: 'specialties',
          id: s.id,
        })),
      };
      for (const spec of record.specialtyRecords) {
        included.set(`specialties:${spec.id}`, {
          type: 'specialties',
          id: spec.id,
          attributes: this.pick(
            spec as unknown as Record<string, unknown>,
            DoctorProjectionParser.attributesFor('specialties', projection),
          ),
        });
      }
    }

    if (projection.include.has('appointments.upcoming')) {
      relationships.upcomingAppointments = {
        data: record.upcomingAppointments.map((a) => ({
          type: 'appointments',
          id: a.id,
        })),
      };
      this.mergeAppointmentIncluded(
        record.upcomingAppointments,
        projection,
        included,
      );
    }

    if (projection.include.has('appointments.history')) {
      relationships.historicalAppointments = {
        data: record.historicalAppointments.map((a) => ({
          type: 'appointments',
          id: a.id,
        })),
      };
      this.mergeAppointmentIncluded(
        record.historicalAppointments,
        projection,
        included,
      );
    }

    const data: Resource = {
      type: 'doctors',
      id: record.doctor.id,
      attributes: this.pick(
        record.doctor as unknown as Record<string, unknown>,
        DoctorProjectionParser.attributesFor('doctors', projection),
      ),
    };

    if (Object.keys(relationships).length > 0) {
      data.relationships = relationships;
    }

    const inc = [...included.values()];
    return inc.length > 0 ? { data, included: inc } : { data };
  }

  private static doctorListResource(
    row: DoctorListRow,
    projection: DoctorProjection,
  ): Resource {
    const resource: Resource = {
      type: 'doctors',
      id: row.doctor.id,
      attributes: this.pick(
        row.doctor as unknown as Record<string, unknown>,
        DoctorProjectionParser.attributesFor('doctors', projection),
      ),
    };

    if (projection.include.has('specialties')) {
      resource.relationships = {
        specialties: {
          data: row.specialtyRecords.map((s) => ({
            type: 'specialties',
            id: s.id,
          })),
        },
      };
    }

    return resource;
  }

  private static mergeAppointmentIncluded(
    appointments: DoctorAppointmentReadRow[],
    projection: DoctorProjection,
    included: Map<string, Resource>,
  ) {
    for (const a of appointments) {
      included.set(`appointments:${a.id}`, {
        type: 'appointments',
        id: a.id,
        attributes: this.pick(
          {
            date: a.date,
            status: a.status,
            reason: a.reason,
          },
          DoctorProjectionParser.attributesFor('appointments', projection),
        ),
        relationships: {
          patient: { data: { type: 'patients', id: a.patient.id } },
          specialty: { data: { type: 'specialties', id: a.specialty.id } },
        },
      });
      included.set(`patients:${a.patient.id}`, {
        type: 'patients',
        id: a.patient.id,
        attributes: this.pick(
          a.patient as unknown as Record<string, unknown>,
          DoctorProjectionParser.attributesFor('patients', projection),
        ),
      });
      included.set(`specialties:${a.specialty.id}`, {
        type: 'specialties',
        id: a.specialty.id,
        attributes: this.pick(
          a.specialty as unknown as Record<string, unknown>,
          DoctorProjectionParser.attributesFor('specialties', projection),
        ),
      });
    }
  }

  private static pick(source: Record<string, unknown>, allowed: string[]) {
    return Object.fromEntries(
      allowed.map((field) => [field, source[field]]),
    );
  }
}
