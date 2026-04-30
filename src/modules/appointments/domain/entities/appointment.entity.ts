import { AppointmentStatus } from '../value-objects/appointment-status.vo';

export class AppointmentEntity {
  constructor(
    readonly id: string,
    readonly patientId: string,
    readonly doctorId: string,
    readonly specialtyId: string,
    readonly date: Date,
    readonly status: AppointmentStatus = 'SCHEDULED',
    readonly reason?: string,
  ) {}
}
