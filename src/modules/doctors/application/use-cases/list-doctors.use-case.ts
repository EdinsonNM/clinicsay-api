import { Inject, Injectable } from '@nestjs/common';
import { DOCTOR_REPOSITORY } from '../ports/doctor.repository';
import type { DoctorRepository } from '../ports/doctor.repository';

@Injectable()
export class ListDoctorsUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY)
    private readonly doctors: DoctorRepository,
  ) {}

  async execute(specialtyId?: string) {
    const data = await this.doctors.list(
      specialtyId ? { specialtyId } : undefined,
    );
    return { data };
  }
}
