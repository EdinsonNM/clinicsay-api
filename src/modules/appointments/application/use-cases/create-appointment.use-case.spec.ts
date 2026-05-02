import { BadRequestException } from '@nestjs/common';
import type { AppointmentRecord } from '../../../shared/demo-clinic.store';
import { CreateAppointmentUseCase } from './create-appointment.use-case';

describe('CreateAppointmentUseCase', () => {
  const validBase = {
    date: '2026-05-01T10:00:00.000Z',
    doctorId: 'd1',
    specialtyId: 's1',
  };

  it('rejects doctor outside specialty', async () => {
    const useCase = new CreateAppointmentUseCase({
      doctorBelongsToSpecialty: () => Promise.resolve(false),
      create: () => Promise.reject(new Error('not expected')),
    });

    await expect(
      useCase.execute({
        ...validBase,
        patientId: 'p1',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects patient existente y paciente nuevo a la vez', async () => {
    const useCase = new CreateAppointmentUseCase({
      doctorBelongsToSpecialty: () => Promise.resolve(true),
      create: () => Promise.reject(new Error('not expected')),
    });

    await expect(
      useCase.execute({
        ...validBase,
        patientId: 'p1',
        patient: { fullName: 'Nuevo', dni: '999' },
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects cuando no hay paciente existente ni nuevo', async () => {
    const useCase = new CreateAppointmentUseCase({
      doctorBelongsToSpecialty: () => Promise.resolve(true),
      create: () => Promise.reject(new Error('not expected')),
    });

    await expect(useCase.execute({ ...validBase })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects fecha invalida', async () => {
    const useCase = new CreateAppointmentUseCase({
      doctorBelongsToSpecialty: () => Promise.resolve(true),
      create: () => Promise.reject(new Error('not expected')),
    });

    await expect(
      useCase.execute({
        ...validBase,
        date: 'no-es-fecha',
        patientId: 'p1',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('delegates create cuando las validaciones pasan', async () => {
    const created: AppointmentRecord = {
      id: 'a-new',
      patientId: 'p1',
      doctorId: 'd1',
      specialtyId: 's1',
      date: validBase.date,
      status: 'SCHEDULED',
    };
    const useCase = new CreateAppointmentUseCase({
      doctorBelongsToSpecialty: () => Promise.resolve(true),
      create: async () => created,
    });

    await expect(
      useCase.execute({ ...validBase, patientId: 'p1' }),
    ).resolves.toEqual(created);
  });
});
