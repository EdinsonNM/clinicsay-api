import {
  AppointmentRecord,
  DoctorRecord,
  PatientRecord,
  SpecialtyRecord,
} from '../../../shared/demo-clinic.store';

export interface AppointmentDetailRecord {
  appointment: AppointmentRecord;
  patient: PatientRecord;
  doctor: DoctorRecord;
  specialty: SpecialtyRecord;
}

export const APPOINTMENT_READ_REPOSITORY = Symbol(
  'APPOINTMENT_READ_REPOSITORY',
);

export interface AppointmentReadRepository {
  findDetail(id: string): Promise<AppointmentDetailRecord | null>;
}
