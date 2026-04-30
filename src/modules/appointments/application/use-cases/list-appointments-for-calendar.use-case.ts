import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { APPOINTMENT_CALENDAR_REPOSITORY } from '../ports/appointment-calendar.repository';
import type { AppointmentCalendarRepository } from '../ports/appointment-calendar.repository';
import { AppointmentJsonApiMapper } from '../../infrastructure/mappers/appointment-jsonapi.mapper';

@Injectable()
export class ListAppointmentsForCalendarUseCase {
  constructor(
    @Inject(APPOINTMENT_CALENDAR_REPOSITORY)
    private readonly repository: AppointmentCalendarRepository,
  ) {}

  async execute(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (
      Number.isNaN(fromDate.getTime()) ||
      Number.isNaN(toDate.getTime()) ||
      fromDate > toDate
    ) {
      throw new BadRequestException('Rango de fechas invalido');
    }
    return AppointmentJsonApiMapper.calendar(
      await this.repository.listByRange(fromDate, toDate),
    );
  }
}
