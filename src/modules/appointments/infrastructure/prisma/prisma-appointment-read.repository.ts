import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DemoClinicStore } from '../../../shared/demo-clinic.store';
import {
  AppointmentDetailRecord,
  AppointmentReadRepository,
} from '../../application/ports/appointment-read.repository';

@Injectable()
export class PrismaAppointmentReadRepository implements AppointmentReadRepository {
  constructor(
    private readonly store: DemoClinicStore,
    private readonly prisma: PrismaService,
  ) {}

  async findDetail(id: string): Promise<AppointmentDetailRecord | null> {
    if (this.prisma.isEnabled) {
      const item = await this.prisma.db.appointment.findUnique({
        where: { id },
        include: { patient: true, doctor: true, specialty: true },
      });
      if (!item) return null;
      return {
        appointment: {
          id: item.id,
          patientId: item.patientId,
          doctorId: item.doctorId,
          specialtyId: item.specialtyId,
          date: item.date.toISOString(),
          status: item.status,
          reason: item.reason ?? undefined,
        },
        patient: {
          id: item.patient.id,
          fullName: item.patient.fullName,
          dni: item.patient.dni,
          email: item.patient.email ?? undefined,
          phone: item.patient.phone ?? undefined,
          address: item.patient.address ?? undefined,
        },
        doctor: {
          id: item.doctor.id,
          name: item.doctor.name,
          cmp: item.doctor.cmp,
        },
        specialty: {
          id: item.specialty.id,
          name: item.specialty.name,
        },
      };
    }

    const appointment = this.store.appointments.find((item) => item.id === id);
    if (!appointment) return Promise.resolve(null);
    const patient = this.store.patients.find(
      (item) => item.id === appointment.patientId,
    );
    const doctor = this.store.doctors.find(
      (item) => item.id === appointment.doctorId,
    );
    const specialty = this.store.specialties.find(
      (item) => item.id === appointment.specialtyId,
    );
    if (!patient || !doctor || !specialty) return Promise.resolve(null);
    return Promise.resolve({ appointment, patient, doctor, specialty });
  }
}
