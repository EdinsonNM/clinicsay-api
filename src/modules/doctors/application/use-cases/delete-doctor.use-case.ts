import { Inject, Injectable } from '@nestjs/common';
import { DOCTOR_REPOSITORY } from '../ports/doctor.repository';
import type { DoctorRepository } from '../ports/doctor.repository';

@Injectable()
export class DeleteDoctorUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY)
    private readonly doctors: DoctorRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.doctors.delete(id);
  }
}
