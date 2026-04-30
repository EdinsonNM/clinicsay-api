import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { APPOINTMENT_WRITE_REPOSITORY } from '../ports/appointment-write.repository';
import type {
  AppointmentWriteRepository,
  CreateAppointmentInput,
} from '../ports/appointment-write.repository';

@Injectable()
export class CreateAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_WRITE_REPOSITORY)
    private readonly repository: AppointmentWriteRepository,
  ) {}

  async execute(input: CreateAppointmentInput) {
    if (
      (input.patientId && input.patient) ||
      (!input.patientId && !input.patient)
    ) {
      throw new BadRequestException(
        'Debe enviar paciente existente o paciente nuevo, no ambos',
      );
    }
    if (!input.date || Number.isNaN(new Date(input.date).getTime())) {
      throw new BadRequestException('Fecha de cita invalida');
    }
    const belongs = await this.repository.doctorBelongsToSpecialty(
      input.doctorId,
      input.specialtyId,
    );
    if (!belongs) {
      throw new BadRequestException(
        'El doctor no pertenece a la especialidad seleccionada',
      );
    }
    return this.repository.create(input);
  }
}
