import { Inject, Injectable } from '@nestjs/common';
import { DOCTOR_REPOSITORY } from '../ports/doctor.repository';
import type { DoctorRepository } from '../ports/doctor.repository';

@Injectable()
export class CreateDoctorUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY)
    private readonly doctors: DoctorRepository,
  ) {}

  async execute(input: {
    name: string;
    cmp: string;
    specialtyIds: string[];
  }) {
    const row = await this.doctors.create(input);
    return { data: row };
  }
}
