export type AppointmentStatus = 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';

export interface PatientRecord {
  id: string;
  fullName: string;
  dni: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface DoctorRecord {
  id: string;
  name: string;
  cmp: string;
}

export interface SpecialtyRecord {
  id: string;
  name: string;
}

export interface AppointmentRecord {
  id: string;
  patientId: string;
  doctorId: string;
  specialtyId: string;
  date: string;
  status: AppointmentStatus;
  reason?: string;
}

export class DemoClinicStore {
  patients: PatientRecord[] = [
    {
      id: 'p-99',
      fullName: 'Juan Perez',
      dni: '12345678A',
      email: 'juan@example.com',
      phone: '999111222',
      address: 'Av. Demo 123',
    },
    { id: 'p-100', fullName: 'Maria Rodriguez', dni: '87654321B' },
  ];

  specialties: SpecialtyRecord[] = [
    { id: 's-1', name: 'Cardiologia' },
    { id: 's-2', name: 'Pediatria' },
    { id: 's-3', name: 'Dermatologia' },
  ];

  doctors: DoctorRecord[] = [
    { id: 'd-44', name: 'Dra. Garcia', cmp: 'CMP001' },
    { id: 'd-45', name: 'Dr. Lopez', cmp: 'CMP002' },
    { id: 'd-46', name: 'Dra. Torres', cmp: 'CMP003' },
  ];

  doctorSpecialties = [
    { doctorId: 'd-44', specialtyId: 's-1' },
    { doctorId: 'd-45', specialtyId: 's-2' },
    { doctorId: 'd-46', specialtyId: 's-1' },
    { doctorId: 'd-46', specialtyId: 's-3' },
  ];

  appointments: AppointmentRecord[] = [
    {
      id: 'cl-12345',
      patientId: 'p-99',
      doctorId: 'd-44',
      specialtyId: 's-1',
      date: '2026-05-15T10:00:00.000Z',
      status: 'SCHEDULED',
      reason: 'Consulta cardiologica',
    },
    {
      id: 'cl-12346',
      patientId: 'p-100',
      doctorId: 'd-45',
      specialtyId: 's-2',
      date: '2026-05-16T11:00:00.000Z',
      status: 'SCHEDULED',
      reason: 'Control pediatrico',
    },
    {
      id: 'cl-12347',
      patientId: 'p-99',
      doctorId: 'd-46',
      specialtyId: 's-3',
      date: '2026-05-10T09:00:00.000Z',
      status: 'COMPLETED',
      reason: 'Revision dermatologica',
    },
  ];

  reset() {
    // Tests create new module instances; production demo keeps state per process.
  }
}
