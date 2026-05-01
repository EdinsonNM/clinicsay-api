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

  it('allows explicit patient private fields without making them defaults', () => {
    const projection = AppointmentProjectionParser.parse({
      include: 'patient',
      'fields[patients]': 'fullName,dni,email,phone,address',
    });

    expect(projection.fields.patients?.has('email')).toBe(true);
    expect(
      AppointmentProjectionParser.attributesFor('patients', {
        include: new Set(['patient']),
        fields: {},
      }),
    ).toEqual(['fullName']);
  });

  it('parses nested sparse fields from bracket query parsers', () => {
    const projection = AppointmentProjectionParser.parse({
      fields: { patients: 'fullName,email' },
    });

    expect(projection.fields.patients?.has('email')).toBe(true);
  });

  it('rejects unknown resources and fields', () => {
    expect(() =>
      AppointmentProjectionParser.parse({ 'fields[unknown]': 'name' }),
    ).toThrow('resource no soportado');
    expect(() =>
      AppointmentProjectionParser.parse({ 'fields[patients]': 'unknown' }),
    ).toThrow('field no soportado');
    expect(() =>
      AppointmentProjectionParser.parse({ include: 'patient,insurance' }),
    ).toThrow('include no soportado');
  });
});
