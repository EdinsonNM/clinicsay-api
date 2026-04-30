import { AppointmentProjectionParser } from './appointment-projection.parser';

describe('AppointmentProjectionParser', () => {
  it('parses includes and sparse fields', () => {
    const projection = AppointmentProjectionParser.parse({
      include: 'patient,doctor.specialty',
      'fields[appointments]': 'date,status',
      'fields[patients]': 'fullName,dni',
    });
    expect(projection.include.has('doctor')).toBe(true);
    expect(projection.fields.patients?.has('dni')).toBe(true);
  });

  it('rejects private fields', () => {
    expect(() =>
      AppointmentProjectionParser.parse({ 'fields[patients]': 'email' }),
    ).toThrow();
  });
});
