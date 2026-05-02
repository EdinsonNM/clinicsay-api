import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DemoClinicStore } from '../../../shared/demo-clinic.store';
import type { DoctorProjection } from '../../application/projection/doctor-projection.parser';
import {
  DoctorAppointmentReadRow,
  DoctorDetailRow,
  DoctorListRow,
  DoctorReadRepository,
} from '../../application/ports/doctor-read.repository';

function startOfTodayUtc(): Date {
  const n = new Date();
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()));
}

function mapAppointmentRow(
  item: {
    id: string;
    patientId: string;
    specialtyId: string;
    date: Date;
    status: string;
    reason: string | null;
    patient: {
      id: string;
      fullName: string;
      dni: string;
      email: string | null;
      phone: string | null;
      address: string | null;
    };
    specialty: { id: string; name: string };
  },
): DoctorAppointmentReadRow {
  return {
    id: item.id,
    patientId: item.patientId,
    specialtyId: item.specialtyId,
    date: item.date.toISOString(),
    status: item.status,
    reason: item.reason ?? undefined,
    patient: {
      id: item.patient.id,
      fullName: item.patient.fullName,
      dni: item.patient.dni,
      email: item.patient.email ?? undefined,
      phone: item.patient.phone ?? undefined,
      address: item.patient.address ?? undefined,
    },
    specialty: { id: item.specialty.id, name: item.specialty.name },
  };
}

@Injectable()
export class PrismaDoctorReadRepository implements DoctorReadRepository {
  constructor(
    private readonly store: DemoClinicStore,
    private readonly prisma: PrismaService,
  ) {}

  async list(
    filter: { specialtyId?: string },
    projection: DoctorProjection,
  ): Promise<DoctorListRow[]> {
    const wantSpecs = projection.include.has('specialties');

    if (this.prisma.isEnabled) {
      const where = filter.specialtyId
        ? { specialties: { some: { specialtyId: filter.specialtyId } } }
        : {};

      if (wantSpecs) {
        type Row = {
          id: string;
          name: string;
          cmp: string;
          specialties: Array<{
            specialtyId: string;
            specialty: { id: string; name: string };
          }>;
        };
        const rows = (await this.prisma.db.doctor.findMany({
          where,
          orderBy: { name: 'asc' },
          include: {
            specialties: { include: { specialty: { select: { id: true, name: true } } } },
          },
        })) as unknown as Row[];

        return rows.map((row) => ({
          doctor: {
            id: row.id,
            name: row.name,
            cmp: row.cmp,
            specialtyIds: row.specialties.map((s) => s.specialtyId),
          },
          specialtyRecords: row.specialties.map((s) => ({
            id: s.specialty.id,
            name: s.specialty.name,
          })),
        }));
      }

      type RowLite = {
        id: string;
        name: string;
        cmp: string;
        specialties: Array<{ specialtyId: string }>;
      };
      const rows = (await this.prisma.db.doctor.findMany({
        where,
        orderBy: { name: 'asc' },
        include: { specialties: { select: { specialtyId: true } } },
      })) as unknown as RowLite[];

      return rows.map((row) => ({
        doctor: {
          id: row.id,
          name: row.name,
          cmp: row.cmp,
          specialtyIds: row.specialties.map((s) => s.specialtyId),
        },
        specialtyRecords: [],
      }));
    }

    return this.demoList(filter, wantSpecs);
  }

  async findDetail(
    id: string,
    projection: DoctorProjection,
  ): Promise<DoctorDetailRow | null> {
    const wantSpecs = projection.include.has('specialties');
    const wantUp = projection.include.has('appointments.upcoming');
    const wantHist = projection.include.has('appointments.history');

    if (this.prisma.isEnabled) {
      type DocRow = {
        id: string;
        name: string;
        cmp: string;
        specialties: Array<{
          specialtyId: string;
          specialty?: { id: string; name: string };
        }>;
      };

      const doctorRow = (await this.prisma.db.doctor.findUnique({
        where: { id },
        include: wantSpecs
          ? {
              specialties: {
                include: { specialty: { select: { id: true, name: true } } },
              },
            }
          : { specialties: { select: { specialtyId: true } } },
      })) as unknown as DocRow | null;

      if (!doctorRow) return null;

      const specialtyIds = doctorRow.specialties.map((s) => s.specialtyId);
      const specialtyRecords = wantSpecs
        ? doctorRow.specialties.map((s) => ({
            id: s.specialty!.id,
            name: s.specialty!.name,
          }))
        : [];

      const start = startOfTodayUtc();

      let upcomingAppointments: DoctorAppointmentReadRow[] = [];
      let historicalAppointments: DoctorAppointmentReadRow[] = [];

      if (wantUp) {
        const items = await this.prisma.db.appointment.findMany({
          where: {
            doctorId: id,
            status: 'SCHEDULED',
            date: { gte: start },
          },
          orderBy: { date: 'asc' },
          include: { patient: true, specialty: true },
        });
        upcomingAppointments = items.map(mapAppointmentRow);
      }

      if (wantHist) {
        const items = await this.prisma.db.appointment.findMany({
          where: {
            doctorId: id,
            OR: [
              { status: { in: ['COMPLETED', 'CANCELLED'] } },
              { status: 'SCHEDULED', date: { lt: start } },
            ],
          },
          orderBy: { date: 'desc' },
          include: { patient: true, specialty: true },
        });
        historicalAppointments = items.map(mapAppointmentRow);
      }

      return {
        doctor: {
          id: doctorRow.id,
          name: doctorRow.name,
          cmp: doctorRow.cmp,
          specialtyIds,
        },
        specialtyRecords,
        upcomingAppointments,
        historicalAppointments,
      };
    }

    return this.demoDetail(id, projection);
  }

  private demoList(
    filter: { specialtyId?: string },
    wantSpecs: boolean,
  ): DoctorListRow[] {
    let doctors = this.store.doctors.slice();

    if (filter.specialtyId) {
      const ids = new Set(
        this.store.doctorSpecialties
          .filter((ds) => ds.specialtyId === filter.specialtyId)
          .map((ds) => ds.doctorId),
      );
      doctors = doctors.filter((d) => ids.has(d.id));
    }

    doctors.sort((a, b) => a.name.localeCompare(b.name));

    return doctors.map((d) => {
      const specialtyIds = this.store.doctorSpecialties
        .filter((ds) => ds.doctorId === d.id)
        .map((ds) => ds.specialtyId);

      const specialtyRecords = wantSpecs
        ? specialtyIds
            .map((sid) => this.store.specialties.find((s) => s.id === sid))
            .filter((s): s is { id: string; name: string } => Boolean(s))
        : [];

      return {
        doctor: { ...d, specialtyIds },
        specialtyRecords,
      };
    });
  }

  private demoDetail(
    id: string,
    projection: DoctorProjection,
  ): DoctorDetailRow | null {
    const doctor = this.store.doctors.find((d) => d.id === id);
    if (!doctor) return null;

    const wantSpecs = projection.include.has('specialties');
    const wantUp = projection.include.has('appointments.upcoming');
    const wantHist = projection.include.has('appointments.history');

    const specialtyIds = this.store.doctorSpecialties
      .filter((ds) => ds.doctorId === id)
      .map((ds) => ds.specialtyId);

    const specialtyRecords = wantSpecs
      ? specialtyIds
          .map((sid) => this.store.specialties.find((s) => s.id === sid))
          .filter((s): s is { id: string; name: string } => Boolean(s))
      : [];

    const start = startOfTodayUtc().getTime();

    const docAppointments = this.store.appointments.filter((a) => a.doctorId === id);

    const mapDemoAppt = (a: (typeof docAppointments)[0]): DoctorAppointmentReadRow | null => {
      const patient = this.store.patients.find((p) => p.id === a.patientId);
      const specialty = this.store.specialties.find((s) => s.id === a.specialtyId);
      if (!patient || !specialty) return null;
      const dateMs = new Date(a.date).getTime();
      return {
        id: a.id,
        patientId: a.patientId,
        specialtyId: a.specialtyId,
        date: new Date(a.date).toISOString(),
        status: a.status,
        reason: a.reason,
        patient: {
          id: patient.id,
          fullName: patient.fullName,
          dni: patient.dni,
          email: patient.email,
          phone: patient.phone,
          address: patient.address,
        },
        specialty: { id: specialty.id, name: specialty.name },
      };
    };

    let upcomingAppointments: DoctorAppointmentReadRow[] = [];
    let historicalAppointments: DoctorAppointmentReadRow[] = [];

    if (wantUp) {
      upcomingAppointments = docAppointments
        .filter((a) => {
          const dateMs = new Date(a.date).getTime();
          return a.status === 'SCHEDULED' && dateMs >= start;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(mapDemoAppt)
        .filter((x): x is DoctorAppointmentReadRow => Boolean(x));
    }

    if (wantHist) {
      historicalAppointments = docAppointments
        .filter((a) => {
          const dateMs = new Date(a.date).getTime();
          return (
            a.status === 'COMPLETED' ||
            a.status === 'CANCELLED' ||
            (a.status === 'SCHEDULED' && dateMs < start)
          );
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(mapDemoAppt)
        .filter((x): x is DoctorAppointmentReadRow => Boolean(x));
    }

    return {
      doctor: { ...doctor, specialtyIds },
      specialtyRecords,
      upcomingAppointments,
      historicalAppointments,
    };
  }
}
