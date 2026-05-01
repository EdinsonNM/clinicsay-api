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

  it('returns explicit private patient fields only when requested', () => {
    const json = AppointmentJsonApiMapper.detail(
      appointmentRecord(),
      {
        include: new Set(['patient']),
        fields: {
          patients: new Set(['fullName', 'email', 'phone', 'address']),
        },
      },
    );

    expect(JSON.stringify(json)).toContain('private@example.com');
    expect(JSON.stringify(json)).toContain('secret');
  });

  it('deduplicates included resources for list responses', () => {
    const json = AppointmentJsonApiMapper.list(
      [appointmentRecord(), { ...appointmentRecord(), appointment: { ...appointmentRecord().appointment, id: 'a2' } }],
      { include: new Set(['patient', 'doctor', 'doctor.specialty']), fields: {} },
    );

    expect(json.data).toHaveLength(2);
    expect(json.included).toHaveLength(3);
  });
});

function appointmentRecord() {
  return {
    appointment: {
      id: 'a1',
      patientId: 'p1',
      doctorId: 'd1',
      specialtyId: 's1',
      date: '2026-05-01T10:00:00.000Z',
      status: 'SCHEDULED' as const,
      reason: 'Consulta',
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
  };
}
