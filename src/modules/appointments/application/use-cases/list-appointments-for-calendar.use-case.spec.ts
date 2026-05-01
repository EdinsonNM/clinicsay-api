import { ListAppointmentsForCalendarUseCase } from './list-appointments-for-calendar.use-case';

describe('ListAppointmentsForCalendarUseCase', () => {
  it('maps projected list responses', async () => {
    const useCase = new ListAppointmentsForCalendarUseCase({
      list: () =>
        Promise.resolve([
          {
            appointment: {
              id: 'a1',
              patientId: 'p1',
              doctorId: 'd1',
              specialtyId: 's1',
              date: '2026-05-15T10:00:00.000Z',
              status: 'SCHEDULED',
            },
            patient: { id: 'p1', fullName: 'Juan', dni: '123' },
            doctor: { id: 'd1', name: 'Dra', cmp: 'CMP' },
            specialty: { id: 's1', name: 'Cardiologia' },
          },
        ]),
    });

    const result = await useCase.execute({
      filters: {
        from: new Date('2026-05-15T00:00:00.000Z'),
        to: new Date('2026-05-15T23:59:59.999Z'),
      },
      projection: { include: new Set(), fields: {} },
    });

    expect(result.data).toHaveLength(1);
  });
});
