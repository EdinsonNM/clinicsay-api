import { DoctorProjectionParser } from './doctor-projection.parser';

describe('DoctorProjectionParser', () => {
  it('en lista solo permite include specialties', () => {
    const p = DoctorProjectionParser.parseListQuery({
      include: 'specialties',
      'fields[doctors]': 'name,cmp',
    });
    expect(p.include.has('specialties')).toBe(true);
    expect(DoctorProjectionParser.attributesFor('doctors', p)).toEqual([
      'name',
      'cmp',
    ]);
  });

  it('rechaza include de citas en listado', () => {
    expect(() =>
      DoctorProjectionParser.parseListQuery({
        include: 'appointments.upcoming',
      }),
    ).toThrow('include no soportado');
  });

  it('en detalle aplica includes por defecto si no hay param include', () => {
    const p = DoctorProjectionParser.parseDetailQuery({});
    expect(p.include.has('specialties')).toBe(true);
    expect(p.include.has('appointments.upcoming')).toBe(true);
    expect(p.include.has('appointments.history')).toBe(true);
  });

  it('en detalle respeta include vacio explicito', () => {
    const p = DoctorProjectionParser.parseDetailQuery({ include: '' });
    expect(p.include.size).toBe(0);
  });

  it('permite campos sparse en pacientes embebidos', () => {
    const p = DoctorProjectionParser.parseDetailQuery({
      include: 'appointments.upcoming',
      'fields[patients]': 'fullName,dni,email',
    });
    expect(DoctorProjectionParser.attributesFor('patients', p)).toEqual([
      'fullName',
      'dni',
      'email',
    ]);
  });
});
