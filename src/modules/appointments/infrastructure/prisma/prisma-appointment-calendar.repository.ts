import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DemoClinicStore } from '../../../shared/demo-clinic.store';
import { AppointmentCalendarRepository } from '../../application/ports/appointment-calendar.repository';
import { AppointmentDetailRecord } from '../../application/ports/appointment-read.repository';

@Injectable()
export class PrismaAppointmentCalendarRepository implements AppointmentCalendarRepository {
  constructor(
    private readonly store: DemoClinicStore,
    private readonly prisma: PrismaService,
  ) {}

  async listByRange(from: Date, to: Date): Promise<AppointmentDetailRecord[]> {
    if (this.prisma.isEnabled) {
      const appointments = await this.prisma.db.appointment.findMany({
        where: { date: { gte: from, lte: to } },
        include: { patient: true, doctor: true, specialty: true },
        orderBy: { date: 'asc' },
      });
      return appointments.map((item) => ({
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
      }));
    }

    return Promise.resolve(
      this.store.appointments
        .filter((appointment) => {
          const date = new Date(appointment.date);
          return date >= from && date <= to;
        })
        .map((appointment) => {
          const patient = this.store.patients.find(
            (item) => item.id === appointment.patientId,
          )!;
          const doctor = this.store.doctors.find(
            (item) => item.id === appointment.doctorId,
          )!;
          const specialty = this.store.specialties.find(
            (item) => item.id === appointment.specialtyId,
          )!;
          return {
            appointment: {
              ...appointment,
              status: appointment.status,
            },
            patient,
            doctor,
            specialty,
          };
        }),
    );
  }
}
