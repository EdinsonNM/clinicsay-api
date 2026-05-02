import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DoctorJsonApiMapper } from '../../infrastructure/mappers/doctor-jsonapi.mapper';
import {
  DOCTOR_READ_REPOSITORY,
  type DoctorReadRepository,
} from '../ports/doctor-read.repository';
import type { GetDoctorDetailQuery } from '../queries/get-doctor-detail.query';

@Injectable()
export class GetDoctorUseCase {
  constructor(
    @Inject(DOCTOR_READ_REPOSITORY)
    private readonly doctorsRead: DoctorReadRepository,
  ) {}

  async execute(query: GetDoctorDetailQuery) {
    const record = await this.doctorsRead.findDetail(query.id, query.projection);
    if (!record) throw new NotFoundException('Doctor no encontrado');
    return DoctorJsonApiMapper.detail(record, query.projection);
  }
}
