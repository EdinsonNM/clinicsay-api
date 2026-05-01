import { ListAppointmentsQueryParser } from './list-appointments.query';

describe('ListAppointmentsQueryParser', () => {
  it('normalizes a single date into a full day range', () => {
    const query = ListAppointmentsQueryParser.parse({ date: '2026-05-15' });

    expect(query.filters.from.toISOString()).toBe('2026-05-15T00:00:00.000Z');
    expect(query.filters.to.toISOString()).toBe('2026-05-15T23:59:59.999Z');
  });

  it('normalizes a valid range', () => {
    const query = ListAppointmentsQueryParser.parse({
      from: '2026-05-01',
      to: '2026-05-31',
      doctorId: 'd-44',
    });

    expect(query.filters.doctorId).toBe('d-44');
    expect(query.filters.from.toISOString()).toBe('2026-05-01T00:00:00.000Z');
    expect(query.filters.to.toISOString()).toBe('2026-05-31T23:59:59.999Z');
  });

  it('allows patient history or scoped filters without a date range', () => {
    const query = ListAppointmentsQueryParser.parse({ patientId: 'p-99' });

    expect(query.filters.patientId).toBe('p-99');
    expect(query.filters.from.toISOString()).toBe('1970-01-01T00:00:00.000Z');
  });

  it('rejects ambiguous or invalid ranges', () => {
    expect(() =>
      ListAppointmentsQueryParser.parse({
        date: '2026-05-15',
        from: '2026-05-01',
        to: '2026-05-31',
      }),
    ).toThrow('no ambos');
    expect(() =>
      ListAppointmentsQueryParser.parse({ from: '2026-05-01' }),
    ).toThrow('from y to');
    expect(() =>
      ListAppointmentsQueryParser.parse({
        from: '2026-05-31',
        to: '2026-05-01',
      }),
    ).toThrow('from > to');
    expect(() =>
      ListAppointmentsQueryParser.parse({ date: '05-15-2026' }),
    ).toThrow('YYYY-MM-DD');
  });

  it('rejects invalid identifiers', () => {
    expect(() =>
      ListAppointmentsQueryParser.parse({
        date: '2026-05-15',
        doctorId: 'd 44',
      }),
    ).toThrow('doctorId');
  });
});
