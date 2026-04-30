import { AppointmentDetailRecord } from './appointment-read.repository';

export const APPOINTMENT_CALENDAR_REPOSITORY = Symbol(
  'APPOINTMENT_CALENDAR_REPOSITORY',
);

export interface AppointmentCalendarRepository {
  listByRange(from: Date, to: Date): Promise<AppointmentDetailRecord[]>;
}
