import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { APPOINTMENT_READ_REPOSITORY } from '../ports/appointment-read.repository';
import type { AppointmentReadRepository } from '../ports/appointment-read.repository';
import { GetAppointmentDetailQuery } from '../queries/get-appointment-detail.query';
import { AppointmentJsonApiMapper } from '../../infrastructure/mappers/appointment-jsonapi.mapper';

@Injectable()
export class GetAppointmentDetailUseCase {
  constructor(
    @Inject(APPOINTMENT_READ_REPOSITORY)
    private readonly repository: AppointmentReadRepository,
  ) {}

  async execute(query: GetAppointmentDetailQuery) {
    const record = await this.repository.findDetail(query.id);
    if (!record) throw new NotFoundException('Cita no encontrada');
    return AppointmentJsonApiMapper.detail(record, query.projection);
  }
}
