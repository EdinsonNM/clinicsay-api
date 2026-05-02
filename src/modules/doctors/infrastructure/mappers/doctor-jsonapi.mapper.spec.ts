import { DoctorJsonApiMapper } from './doctor-jsonapi.mapper';
import type { DoctorDetailRow } from '../../application/ports/doctor-read.repository';
import { DoctorProjectionParser } from '../../application/projection/doctor-projection.parser';

describe('DoctorJsonApiMapper', () => {
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
