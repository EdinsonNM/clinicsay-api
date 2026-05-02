import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DemoClinicStore } from '../../../shared/demo-clinic.store';
import {
  DoctorCatalogRecord,
  DoctorRepository,
} from '../../application/ports/doctor.repository';

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
}

@Injectable()
export class PrismaDoctorRepository implements DoctorRepository {
  constructor(
    private readonly store: DemoClinicStore,
    private readonly prisma: PrismaService,
  ) {}

  private mapRow(
    row: {
      id: string;
      name: string;
      cmp: string;
      specialties: Array<{ specialtyId: string }>;
    },
  ): DoctorCatalogRecord {
    return {
      id: row.id,
      name: row.name,
      cmp: row.cmp,
      specialtyIds: row.specialties.map((s) => s.specialtyId),
    };
  }

  private demoRecord(doctor: { id: string; name: string; cmp: string }): DoctorCatalogRecord {
    const specialtyIds = this.store.doctorSpecialties
      .filter((ds) => ds.doctorId === doctor.id)
      .map((ds) => ds.specialtyId);
    return { ...doctor, specialtyIds };
  }

  private async ensureSpecialtiesExist(ids: string[]): Promise<void> {
    if (ids.length === 0) {
      throw new BadRequestException('Debe indicar al menos una especialidad');
    }
    const unique = new Set(ids);
    if (unique.size !== ids.length) {
      throw new BadRequestException('Especialidades duplicadas');
    }

    if (this.prisma.isEnabled) {
      const count = await this.prisma.db.specialty.count({
        where: { id: { in: ids } },
      });
      if (count !== ids.length) {
        throw new BadRequestException('Una o mas especialidades no existen');
      }
      return;
    }

    for (const sid of ids) {
      if (!this.store.specialties.some((s) => s.id === sid)) {
        throw new BadRequestException('Una o mas especialidades no existen');
      }
    }
  }

  async list(filter?: { specialtyId?: string }): Promise<DoctorCatalogRecord[]> {
    if (this.prisma.isEnabled) {
      if (filter?.specialtyId) {
        type DoctorWithSpecs = {
          id: string;
          name: string;
          cmp: string;
          specialties: Array<{ specialtyId: string }>;
        };
        const relations = (await this.prisma.db.doctorSpecialty.findMany({
          where: { specialtyId: filter.specialtyId },
          include: {
            doctor: {
              include: {
                specialties: { select: { specialtyId: true } },
              },
            },
          },
          orderBy: { doctor: { name: 'asc' } },
        })) as unknown as Array<{ doctor: DoctorWithSpecs }>;
        return relations.map((r) => this.mapRow(r.doctor));
      }

      const doctors = await this.prisma.db.doctor.findMany({
        orderBy: { name: 'asc' },
        include: { specialties: { select: { specialtyId: true } } },
      });
      return doctors.map((d) => this.mapRow(d));
    }

    if (filter?.specialtyId) {
      const doctorIds = new Set(
        this.store.doctorSpecialties
          .filter((item) => item.specialtyId === filter.specialtyId)
          .map((item) => item.doctorId),
      );
      return this.store.doctors
        .filter((d) => doctorIds.has(d.id))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((d) => this.demoRecord(d));
    }

    return this.store.doctors
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((d) => this.demoRecord(d));
  }

  async findById(id: string): Promise<DoctorCatalogRecord | null> {
    if (this.prisma.isEnabled) {
      const row = await this.prisma.db.doctor.findUnique({
        where: { id },
        include: { specialties: { select: { specialtyId: true } } },
      });
      return row ? this.mapRow(row) : null;
    }

    const doctor = this.store.doctors.find((d) => d.id === id);
    return doctor ? this.demoRecord(doctor) : null;
  }

  async create(input: {
    name: string;
    cmp: string;
    specialtyIds: string[];
  }): Promise<DoctorCatalogRecord> {
    await this.ensureSpecialtiesExist(input.specialtyIds);
    const name = input.name.trim();
    const cmp = input.cmp.trim();

    if (this.prisma.isEnabled) {
      try {
        const row = await this.prisma.db.doctor.create({
          data: {
            name,
            cmp,
            specialties: {
              create: input.specialtyIds.map((specialtyId) => ({ specialtyId })),
            },
          },
          include: { specialties: { select: { specialtyId: true } } },
        });
        return this.mapRow(row);
      } catch (e) {
        if (isUniqueViolation(e)) {
          throw new ConflictException('Ya existe un doctor con ese CMP');
        }
        throw e;
      }
    }

    if (this.store.doctors.some((d) => d.cmp === cmp)) {
      throw new ConflictException('Ya existe un doctor con ese CMP');
    }
    const doctor = {
      id: `d-${Date.now()}`,
      name,
      cmp,
    };
    this.store.doctors.push(doctor);
    for (const specialtyId of input.specialtyIds) {
      this.store.doctorSpecialties.push({
        doctorId: doctor.id,
        specialtyId,
      });
    }
    return this.demoRecord(doctor);
  }

  async update(
    id: string,
    input: { name?: string; cmp?: string; specialtyIds?: string[] },
  ): Promise<DoctorCatalogRecord> {
    if (input.specialtyIds !== undefined) {
      await this.ensureSpecialtiesExist(input.specialtyIds);
    }

    if (this.prisma.isEnabled) {
      try {
        const data: {
          name?: string;
          cmp?: string;
          specialties?: {
            deleteMany: Record<string, never>;
            create: Array<{ specialtyId: string }>;
          };
        } = {};
        if (input.name !== undefined) data.name = input.name.trim();
        if (input.cmp !== undefined) data.cmp = input.cmp.trim();
        if (input.specialtyIds !== undefined) {
          data.specialties = {
            deleteMany: {},
            create: input.specialtyIds.map((specialtyId) => ({ specialtyId })),
          };
        }
        const row = await this.prisma.db.doctor.update({
          where: { id },
          data,
          include: { specialties: { select: { specialtyId: true } } },
        });
        return this.mapRow(row);
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') throw new NotFoundException('Doctor no encontrado');
          if (e.code === 'P2002') {
            throw new ConflictException('Ya existe un doctor con ese CMP');
          }
        }
        throw e;
      }
    }

    const idx = this.store.doctors.findIndex((d) => d.id === id);
    if (idx === -1) throw new NotFoundException('Doctor no encontrado');

    if (input.cmp !== undefined) {
      const cmp = input.cmp.trim();
      if (this.store.doctors.some((d) => d.cmp === cmp && d.id !== id)) {
        throw new ConflictException('Ya existe un doctor con ese CMP');
      }
      this.store.doctors[idx] = { ...this.store.doctors[idx], cmp };
    }
    if (input.name !== undefined) {
      this.store.doctors[idx] = {
        ...this.store.doctors[idx],
        name: input.name.trim(),
      };
    }
    if (input.specialtyIds !== undefined) {
      this.store.doctorSpecialties = this.store.doctorSpecialties.filter(
        (ds) => ds.doctorId !== id,
      );
      for (const specialtyId of input.specialtyIds) {
        this.store.doctorSpecialties.push({ doctorId: id, specialtyId });
      }
    }

    return this.demoRecord(this.store.doctors[idx]);
  }

  async delete(id: string): Promise<void> {
    if (this.prisma.isEnabled) {
      const appointments = await this.prisma.db.appointment.count({
        where: { doctorId: id },
      });
      if (appointments > 0) {
        throw new ConflictException(
          'No se puede eliminar el doctor: hay citas asociadas',
        );
      }
      await this.prisma.db.doctorSpecialty.deleteMany({ where: { doctorId: id } });
      try {
        await this.prisma.db.doctor.delete({ where: { id } });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
          throw new NotFoundException('Doctor no encontrado');
        }
        throw e;
      }
      return;
    }

    if (!this.store.doctors.some((d) => d.id === id)) {
      throw new NotFoundException('Doctor no encontrado');
    }
    if (this.store.appointments.some((a) => a.doctorId === id)) {
      throw new ConflictException(
        'No se puede eliminar el doctor: hay citas asociadas',
      );
    }
    this.store.doctorSpecialties = this.store.doctorSpecialties.filter(
      (ds) => ds.doctorId !== id,
    );
    this.store.doctors = this.store.doctors.filter((d) => d.id !== id);
  }
}
