import type { DoctorProjection } from '../projection/doctor-projection.parser';

export const DOCTOR_READ_REPOSITORY = Symbol('DOCTOR_READ_REPOSITORY');

export interface DoctorListRow {
  doctor: {
    id: string;
    name: string;
    cmp: string;
    specialtyIds: string[];
  };
  /** Solo se rellena cuando la proyeccion pide include=specialties */
  specialtyRecords: Array<{ id: string; name: string }>;
}

export interface DoctorAppointmentReadRow {
  id: string;
  patientId: string;
  specialtyId: string;
  date: string;
  status: string;
  reason?: string;
  patient: {
    id: string;
    fullName: string;
    dni: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  specialty: { id: string; name: string };
}

export interface DoctorDetailRow {
  doctor: {
    id: string;
    name: string;
    cmp: string;
    specialtyIds: string[];
  };
  specialtyRecords: Array<{ id: string; name: string }>;
  upcomingAppointments: DoctorAppointmentReadRow[];
  historicalAppointments: DoctorAppointmentReadRow[];
}

export interface DoctorReadRepository {
  list(
    filter: { specialtyId?: string },
    projection: DoctorProjection,
  ): Promise<DoctorListRow[]>;

  findDetail(
    id: string,
    projection: DoctorProjection,
  ): Promise<DoctorDetailRow | null>;
}
