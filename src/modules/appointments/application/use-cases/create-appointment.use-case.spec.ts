import { BadRequestException } from '@nestjs/common';
import { CreateAppointmentUseCase } from './create-appointment.use-case';

describe('CreateAppointmentUseCase', () => {
  it('rejects doctor outside specialty', async () => {
    const useCase = new CreateAppointmentUseCase({
      doctorBelongsToSpecialty: () => Promise.resolve(false),
      create: () => Promise.reject(new Error('not expected')),
    });

    await expect(
      useCase.execute({
        date: '2026-05-01T10:00:00.000Z',
        doctorId: 'd1',
        specialtyId: 's1',
        patientId: 'p1',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
