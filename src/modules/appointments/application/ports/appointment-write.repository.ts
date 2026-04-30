import {
  AppointmentRecord,
  PatientRecord,
} from '../../../shared/demo-clinic.store';

export const APPOINTMENT_WRITE_REPOSITORY = Symbol(
  'APPOINTMENT_WRITE_REPOSITORY',
);

export interface CreateAppointmentInput {
  date: string;
  doctorId: string;
  specialtyId: string;
  patientId?: string;
  patient?: Pick<PatientRecord, 'fullName' | 'dni'>;
  reason?: string;
}

export interface AppointmentWriteRepository {
  doctorBelongsToSpecialty(
    doctorId: string,
    specialtyId: string,
  ): Promise<boolean>;
  create(input: CreateAppointmentInput): Promise<AppointmentRecord>;
}
