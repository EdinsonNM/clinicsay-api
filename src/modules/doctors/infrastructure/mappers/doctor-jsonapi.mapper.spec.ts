import { DoctorJsonApiMapper } from './doctor-jsonapi.mapper';
import type { DoctorDetailRow } from '../../application/ports/doctor-read.repository';
import { DoctorProjectionParser } from '../../application/projection/doctor-projection.parser';

describe('DoctorJsonApiMapper', () => {
  it('en lista incluye especialidades cuando la proyeccion lo pide', () => {
    const projection = DoctorProjectionParser.parseListQuery({
      include: 'specialties',
    });
    const body = DoctorJsonApiMapper.list(
      [
        {
          doctor: {
            id: 'd-1',
            name: 'Dr Demo',
            cmp: 'CMP1',
            specialtyIds: ['s-1'],
          },
          specialtyRecords: [{ id: 's-1', name: 'Cardiologia' }],
        },
      ],
      projection,
    ) as { included?: unknown[] };

    expect(body.included?.some((r) => (r as { type: string }).type === 'specialties')).toBe(
      true,
    );
  });

  it('serializa historico de citas cuando include lo pide', () => {
    const projection = DoctorProjectionParser.parseDetailQuery({
      include: 'appointments.history',
    });
    const record: DoctorDetailRow = {
      doctor: {
        id: 'd-1',
        name: 'Dr Demo',
        cmp: 'CMP1',
        specialtyIds: ['s-1'],
      },
      specialtyRecords: [],
      upcomingAppointments: [],
      historicalAppointments: [
        {
          id: 'ap-h',
          patientId: 'p-1',
          specialtyId: 's-1',
          date: '2026-01-01T10:00:00.000Z',
          status: 'COMPLETED',
          patient: {
            id: 'p-1',
            fullName: 'Juan',
            dni: '111',
          },
          specialty: { id: 's-1', name: 'Cardiologia' },
        },
      ],
    };

    const body = DoctorJsonApiMapper.detail(record, projection) as {
      data: { relationships: Record<string, unknown> };
      included: Array<{ type: string }>;
    };

    expect(body.data.relationships.historicalAppointments).toBeDefined();
    expect(body.included.some((r) => r.type === 'appointments')).toBe(true);
  });

  it('serializa detalle con citas y relaciones', () => {
    const projection = DoctorProjectionParser.parseDetailQuery({
      include: 'specialties,appointments.upcoming',
    });
    const record: DoctorDetailRow = {
      doctor: {
        id: 'd-1',
        name: 'Dr. Demo',
        cmp: 'CMP1',
        specialtyIds: ['s-1'],
      },
      specialtyRecords: [{ id: 's-1', name: 'Cardiologia' }],
      upcomingAppointments: [
        {
          id: 'ap-1',
          patientId: 'p-1',
          specialtyId: 's-1',
          date: '2026-06-01T10:00:00.000Z',
          status: 'SCHEDULED',
          patient: {
            id: 'p-1',
            fullName: 'Juan',
            dni: '111',
          },
          specialty: { id: 's-1', name: 'Cardiologia' },
        },
      ],
      historicalAppointments: [],
    };

    const body = DoctorJsonApiMapper.detail(record, projection) as {
      data: { relationships: Record<string, unknown> };
      included: Array<{ type: string; id: string }>;
    };

    expect(body.data.relationships.upcomingAppointments).toBeDefined();
    expect(body.included.some((r) => r.type === 'appointments')).toBe(true);
    expect(body.included.some((r) => r.type === 'patients')).toBe(true);
  });
});
