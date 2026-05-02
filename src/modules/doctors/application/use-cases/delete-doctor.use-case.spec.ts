import type { DoctorRepository } from '../ports/doctor.repository';
import { DeleteDoctorUseCase } from './delete-doctor.use-case';

describe('DeleteDoctorUseCase', () => {
  it('delegates delete en el repositorio', async () => {
    let deletedId: string | undefined;
    const repo: DoctorRepository = {
      list: async () => [],
      findById: async () => null,
      create: async () => ({
        id: '',
        name: '',
        cmp: '',
        specialtyIds: [],
      }),
      update: async () => ({
        id: '',
        name: '',
        cmp: '',
        specialtyIds: [],
      }),
      delete: async (id: string) => {
        deletedId = id;
      },
    };

    await new DeleteDoctorUseCase(repo).execute('d-1');
    expect(deletedId).toBe('d-1');
  });
});
