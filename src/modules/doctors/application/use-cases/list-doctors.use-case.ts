import { Inject, Injectable } from '@nestjs/common';
import { DoctorJsonApiMapper } from '../../infrastructure/mappers/doctor-jsonapi.mapper';
import {
  DOCTOR_READ_REPOSITORY,
  type DoctorReadRepository,
} from '../ports/doctor-read.repository';
import type { ListDoctorsQuery } from '../queries/list-doctors.query';

@Injectable()
export class ListDoctorsUseCase {
  constructor(
    @Inject(DOCTOR_READ_REPOSITORY)
    private readonly doctorsRead: DoctorReadRepository,
  ) {}

  async execute(query: ListDoctorsQuery) {
    const rows = await this.doctorsRead.list(
      { specialtyId: query.specialtyId },
      query.projection,
    );
    return DoctorJsonApiMapper.list(rows, query.projection);
  }
}
