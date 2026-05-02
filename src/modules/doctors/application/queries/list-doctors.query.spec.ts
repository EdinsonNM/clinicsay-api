import { BadRequestException } from '@nestjs/common';
import { ListDoctorsQueryParser } from './list-doctors.query';

describe('ListDoctorsQueryParser', () => {
  it('acepta specialtyId opcional valido', () => {
    const q = ListDoctorsQueryParser.parse({ specialtyId: 's-1' });
    expect(q.specialtyId).toBe('s-1');
  });

  it('normaliza specialtyId cuando llega como array de un elemento', () => {
    const q = ListDoctorsQueryParser.parse({ specialtyId: ['s-88'] });
    expect(q.specialtyId).toBe('s-88');
  });

  it('rechaza specialtyId con formato invalido', () => {
    expect(() =>
      ListDoctorsQueryParser.parse({ specialtyId: 's 1' }),
    ).toThrow(BadRequestException);
  });
});
