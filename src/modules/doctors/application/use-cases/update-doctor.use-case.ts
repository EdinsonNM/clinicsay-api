import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { DOCTOR_REPOSITORY } from '../ports/doctor.repository';
import type { DoctorRepository } from '../ports/doctor.repository';

@Injectable()
export class UpdateDoctorUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY)
    private readonly doctors: DoctorRepository,
  ) {}

  async execute(
    id: string,
    input: { name?: string; cmp?: string; specialtyIds?: string[] },
  ) {
    const hasChange =
      input.name !== undefined ||
      input.cmp !== undefined ||
      input.specialtyIds !== undefined;
    if (!hasChange) {
      throw new BadRequestException('No hay cambios para aplicar');
    }
    const row = await this.doctors.update(id, input);
    return { data: row };
  }
}
