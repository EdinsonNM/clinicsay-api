import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DemoClinicStore } from '../../../shared/demo-clinic.store';
import {
  AppointmentWriteRepository,
  CreateAppointmentInput,
} from '../../application/ports/appointment-write.repository';

@Injectable()
export class PrismaAppointmentWriteRepository implements AppointmentWriteRepository {
  constructor(
    private readonly store: DemoClinicStore,
    private readonly prisma: PrismaService,
  ) {}

  async doctorBelongsToSpecialty(
    doctorId: string,
    specialtyId: string,
  ): Promise<boolean> {
    if (this.prisma.isEnabled) {
      const relation = await this.prisma.db.doctorSpecialty.findUnique({
        where: { doctorId_specialtyId: { doctorId, specialtyId } },
      });
      return Boolean(relation);
    }

    return Promise.resolve(
      this.store.doctorSpecialties.some(
        (item) =>
          item.doctorId === doctorId && item.specialtyId === specialtyId,
      ),
    );
  }

  async create(input: CreateAppointmentInput) {
    if (this.prisma.isEnabled) {
      const doctor = await this.prisma.db.doctor.findUnique({
        where: { id: input.doctorId },
      });
      if (!doctor) throw new NotFoundException('Doctor no encontrado');
      const specialty = await this.prisma.db.specialty.findUnique({
        where: { id: input.specialtyId },
      });
      if (!specialty) throw new NotFoundException('Especialidad no encontrada');

      let patientId = input.patientId;
      if (patientId) {
        const patient = await this.prisma.db.patient.findUnique({
          where: { id: patientId },
        });
        if (!patient) throw new NotFoundException('Paciente no encontrado');
      } else if (input.patient) {
        const existing = await this.prisma.db.patient.findUnique({
          where: { dni: input.patient.dni },
        });
        if (existing)
          throw new BadRequestException(
            'El DNI ya existe; seleccione el paciente existente',
          );
        const patient = await this.prisma.db.patient.create({
          data: input.patient,
        });
        patientId = patient.id;
      }

      if (!patientId)
        throw new BadRequestException(
          'Debe enviar paciente existente o paciente nuevo',
        );

      const appointment = await this.prisma.db.appointment.create({
        data: {
          patientId,
          doctorId: input.doctorId,
          specialtyId: input.specialtyId,
          date: new Date(input.date),
          reason: input.reason,
        },
      });
      return {
        id: appointment.id,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        specialtyId: appointment.specialtyId,
        date: appointment.date.toISOString(),
        status: appointment.status,
        reason: appointment.reason ?? undefined,
      };
    }

    const doctor = this.store.doctors.find(
      (item) => item.id === input.doctorId,
    );
    if (!doctor) throw new NotFoundException('Doctor no encontrado');
    const specialty = this.store.specialties.find(
      (item) => item.id === input.specialtyId,
    );
    if (!specialty) throw new NotFoundException('Especialidad no encontrada');

    let patientId = input.patientId;
    if (patientId) {
      if (!this.store.patients.some((item) => item.id === patientId)) {
        throw new NotFoundException('Paciente no encontrado');
      }
    } else if (input.patient) {
      const existing = this.store.patients.find(
        (item) => item.dni === input.patient!.dni,
      );
      if (existing)
        throw new BadRequestException(
          'El DNI ya existe; seleccione el paciente existente',
        );
      const patient = {
        id: `p-${Date.now()}`,
        fullName: input.patient.fullName,
        dni: input.patient.dni,
      };
      this.store.patients.push(patient);
      patientId = patient.id;
    }

    if (!patientId)
      throw new BadRequestException(
        'Debe enviar paciente existente o paciente nuevo',
      );

    const appointment = {
      id: `cl-${Date.now()}`,
      patientId,
      doctorId: input.doctorId,
      specialtyId: input.specialtyId,
      date: new Date(input.date).toISOString(),
      status: 'SCHEDULED' as const,
      reason: input.reason,
    };
    this.store.appointments.push(appointment);
    return Promise.resolve(appointment);
  }
}
