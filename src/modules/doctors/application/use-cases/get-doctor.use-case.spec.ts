import { NotFoundException } from '@nestjs/common';
import type { DoctorDetailRow } from '../ports/doctor-read.repository';
import { DoctorProjectionParser } from '../projection/doctor-projection.parser';
import { GetDoctorUseCase } from './get-doctor.use-case';

describe('GetDoctorUseCase', () => {
  const emptyProjection = DoctorProjectionParser.parseDetailQuery({
    include: '',
  });

  it('lanza NotFound cuando no hay doctor', async () => {
    const useCase = new GetDoctorUseCase({
      findDetail: async () => null,
      list: async () => [],
    });

    await expect(
      useCase.execute({ id: 'missing', projection: emptyProjection }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('devuelve documento JSON:API cuando existe', async () => {
    const record: DoctorDetailRow = {
      doctor: { id: 'd-1', name: 'Dr Demo', cmp: 'CMP1', specialtyIds: [] },
      specialtyRecords: [],
      upcomingAppointments: [],
      historicalAppointments: [],
    };
    const useCase = new GetDoctorUseCase({
      findDetail: async () => record,
      list: async () => [],
    });

    const body = await useCase.execute({
      id: 'd-1',
      projection: emptyProjection,
    });

    expect(body).toMatchObject({
      data: { type: 'doctors', id: 'd-1' },
    });
  });
});
