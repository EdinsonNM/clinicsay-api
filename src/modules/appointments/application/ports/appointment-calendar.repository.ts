import { AppointmentDetailRecord } from './appointment-read.repository';
import { AppointmentListFilters } from '../queries/list-appointments.query';

export const APPOINTMENT_CALENDAR_REPOSITORY = Symbol(
  'APPOINTMENT_CALENDAR_REPOSITORY',
);

export interface AppointmentCalendarRepository {
  list(filters: AppointmentListFilters): Promise<AppointmentDetailRecord[]>;
}
