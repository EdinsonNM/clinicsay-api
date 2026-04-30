import { AppointmentJsonApiMapper } from './appointment-jsonapi.mapper';

describe('AppointmentJsonApiMapper', () => {
  it('does not leak private patient fields', () => {
    const json = AppointmentJsonApiMapper.detail(
      {
        appointment: {
          id: 'a1',
          patientId: 'p1',
          doctorId: 'd1',
          specialtyId: 's1',
          date: '2026-05-01T10:00:00.000Z',
          status: 'SCHEDULED',
        },
        patient: {
          id: 'p1',
          fullName: 'Juan',
          dni: '123',
          email: 'private@example.com',
          phone: '999',
          address: 'secret',
        },
        doctor: { id: 'd1', name: 'Dra', cmp: 'CMP' },
        specialty: { id: 's1', name: 'Cardiologia' },
      },
      { include: new Set(['patient']), fields: {} },
    );
    expect(JSON.stringify(json)).not.toContain('private@example.com');
  });
});
