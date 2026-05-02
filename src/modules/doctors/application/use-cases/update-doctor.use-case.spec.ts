import { BadRequestException } from '@nestjs/common';
import type { DoctorRepository } from '../ports/doctor.repository';
import { UpdateDoctorUseCase } from './update-doctor.use-case';

describe('UpdateDoctorUseCase', () => {
  const row = {
    id: 'd-1',
    name: 'Dr',
    cmp: 'CMP',
    specialtyIds: [] as string[],
  };

  const repo: DoctorRepository = {
    list: async () => [],
    findById: async () => row,
    create: async () => row,
    update: async () => ({ ...row, name: 'Dr Actualizado' }),
    delete: async () => {},
  };

  it('rechaza payload sin ningun cambio', async () => {
    await expect(
      new UpdateDoctorUseCase(repo).execute('d-1', {}),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('delegates update y devuelve datos', async () => {
    await expect(
      new UpdateDoctorUseCase(repo).execute('d-1', { name: 'Dr Actualizado' }),
    ).resolves.toEqual({
      data: { ...row, name: 'Dr Actualizado' },
    });
  });
});
