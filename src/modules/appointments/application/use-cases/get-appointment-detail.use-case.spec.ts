import { NotFoundException } from '@nestjs/common';
import { GetAppointmentDetailUseCase } from './get-appointment-detail.use-case';

describe('GetAppointmentDetailUseCase', () => {
  it('maps found appointment detail', async () => {
    const useCase = new GetAppointmentDetailUseCase({
      findDetail: () =>
        Promise.resolve({
          appointment: {
            id: 'a1',
            patientId: 'p1',
            doctorId: 'd1',
            specialtyId: 's1',
            date: '2026-05-01T10:00:00.000Z',
            status: 'SCHEDULED',
          },
          patient: { id: 'p1', fullName: 'Juan', dni: '123' },
          doctor: { id: 'd1', name: 'Dra', cmp: 'CMP' },
          specialty: { id: 's1', name: 'Cardiologia' },
        }),
    });

    const result = await useCase.execute({
      id: 'a1',
      projection: { include: new Set(), fields: {} },
    });
    expect(result.data.id).toBe('a1');
  });

  it('throws not found', async () => {
    const useCase = new GetAppointmentDetailUseCase({
      findDetail: () => Promise.resolve(null),
    });
    await expect(
      useCase.execute({
        id: 'missing',
        projection: { include: new Set(), fields: {} },
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
