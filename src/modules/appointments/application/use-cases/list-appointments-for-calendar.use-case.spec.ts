import { ListAppointmentsForCalendarUseCase } from './list-appointments-for-calendar.use-case';

describe('ListAppointmentsForCalendarUseCase', () => {
  it('rejects invalid ranges', async () => {
    const useCase = new ListAppointmentsForCalendarUseCase({
      listByRange: () => Promise.resolve([]),
    });
    await expect(useCase.execute('2026-05-31', '2026-05-01')).rejects.toThrow();
  });
});
