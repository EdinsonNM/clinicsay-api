import { CreateDoctorUseCase } from './create-doctor.use-case';
import type { DoctorRepository } from '../ports/doctor.repository';

describe('CreateDoctorUseCase', () => {
  it('devuelve la fila creada', async () => {
    const created = {
      id: 'd-new',
      name: 'Dr Nueva',
      cmp: 'CMP99',
      specialtyIds: ['s-1'],
    };
    const repo: DoctorRepository = {
      list: async () => [],
      findById: async () => null,
      create: async () => created,
      update: async () => created,
      delete: async () => {},
    };

    await expect(
      new CreateDoctorUseCase(repo).execute({
        name: 'Dr Nueva',
        cmp: 'CMP99',
        specialtyIds: ['s-1'],
      }),
    ).resolves.toEqual({ data: created });
  });
});
