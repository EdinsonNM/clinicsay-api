import { Inject, Injectable } from '@nestjs/common';
import { APPOINTMENT_CALENDAR_REPOSITORY } from '../ports/appointment-calendar.repository';
import type { AppointmentCalendarRepository } from '../ports/appointment-calendar.repository';
import { AppointmentJsonApiMapper } from '../../infrastructure/mappers/appointment-jsonapi.mapper';
import { ListAppointmentsQuery } from '../queries/list-appointments.query';

@Injectable()
export class ListAppointmentsForCalendarUseCase {
  constructor(
    @Inject(APPOINTMENT_CALENDAR_REPOSITORY)
    private readonly repository: AppointmentCalendarRepository,
  ) {}

  async execute(query: ListAppointmentsQuery) {
    return AppointmentJsonApiMapper.list(
      await this.repository.list(query.filters),
      query.projection,
    );
  }
}
