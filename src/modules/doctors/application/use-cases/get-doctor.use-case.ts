import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DOCTOR_REPOSITORY } from '../ports/doctor.repository';
import type { DoctorRepository } from '../ports/doctor.repository';

@Injectable()
export class GetDoctorUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY)
    private readonly doctors: DoctorRepository,
  ) {}

  async execute(id: string) {
    const row = await this.doctors.findById(id);
    if (!row) throw new NotFoundException('Doctor no encontrado');
    return { data: row };
  }
}
