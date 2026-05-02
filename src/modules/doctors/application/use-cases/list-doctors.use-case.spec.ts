import { DoctorProjectionParser } from '../projection/doctor-projection.parser';
import { ListDoctorsUseCase } from './list-doctors.use-case';

describe('ListDoctorsUseCase', () => {
  it('devuelve lista vacia cuando el repositorio no tiene filas', async () => {
    const projection = DoctorProjectionParser.parseListQuery({});
    const useCase = new ListDoctorsUseCase({
      list: async () => [],
      findDetail: async () => null,
    });

    await expect(
      useCase.execute({ projection }),
    ).resolves.toEqual({ data: [] });
  });
});
