import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DemoClinicStore } from '../../../shared/demo-clinic.store';
import {
  SpecialtyRecord,
  SpecialtyRepository,
} from '../../application/ports/specialty.repository';

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
}

@Injectable()
export class PrismaSpecialtyRepository implements SpecialtyRepository {
  constructor(
    private readonly store: DemoClinicStore,
    private readonly prisma: PrismaService,
  ) {}

  async list(): Promise<SpecialtyRecord[]> {
    if (this.prisma.isEnabled) {
      const rows = await this.prisma.db.specialty.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      });
      return rows;
    }

    return [...this.store.specialties].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }

  async findById(id: string): Promise<SpecialtyRecord | null> {
    if (this.prisma.isEnabled) {
      return this.prisma.db.specialty.findUnique({
        where: { id },
        select: { id: true, name: true },
      });
    }

    const row = this.store.specialties.find((s) => s.id === id);
    return row ? { ...row } : null;
  }

  async create(input: { name: string }): Promise<SpecialtyRecord> {
    const name = input.name.trim();
    if (this.prisma.isEnabled) {
      try {
        const row = await this.prisma.db.specialty.create({
          data: { name },
          select: { id: true, name: true },
        });
        return row;
      } catch (e) {
        if (isUniqueViolation(e)) {
          throw new ConflictException('Ya existe una especialidad con ese nombre');
        }
        throw e;
      }
    }

    if (this.store.specialties.some((s) => s.name === name)) {
      throw new ConflictException('Ya existe una especialidad con ese nombre');
    }
    const row = { id: `s-${Date.now()}`, name };
    this.store.specialties.push(row);
    return { ...row };
  }

  async update(id: string, input: { name: string }): Promise<SpecialtyRecord> {
    const name = input.name.trim();
    if (this.prisma.isEnabled) {
      try {
        const row = await this.prisma.db.specialty.update({
          where: { id },
          data: { name },
          select: { id: true, name: true },
        });
        return row;
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') throw new NotFoundException('Especialidad no encontrada');
          if (e.code === 'P2002') {
            throw new ConflictException('Ya existe una especialidad con ese nombre');
          }
        }
        throw e;
      }
    }

    const idx = this.store.specialties.findIndex((s) => s.id === id);
    if (idx === -1) throw new NotFoundException('Especialidad no encontrada');
    if (
      this.store.specialties.some((s) => s.name === name && s.id !== id)
    ) {
      throw new ConflictException('Ya existe una especialidad con ese nombre');
    }
    this.store.specialties[idx] = { ...this.store.specialties[idx], name };
    return { ...this.store.specialties[idx] };
  }

  async delete(id: string): Promise<void> {
    if (this.prisma.isEnabled) {
      const appointments = await this.prisma.db.appointment.count({
        where: { specialtyId: id },
      });
      if (appointments > 0) {
        throw new ConflictException(
          'No se puede eliminar la especialidad: hay citas asociadas',
        );
      }
      await this.prisma.db.doctorSpecialty.deleteMany({
        where: { specialtyId: id },
      });
      try {
        await this.prisma.db.specialty.delete({ where: { id } });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
          throw new NotFoundException('Especialidad no encontrada');
        }
        throw e;
      }
      return;
    }

    if (!this.store.specialties.some((s) => s.id === id)) {
      throw new NotFoundException('Especialidad no encontrada');
    }
    if (this.store.appointments.some((a) => a.specialtyId === id)) {
      throw new ConflictException(
        'No se puede eliminar la especialidad: hay citas asociadas',
      );
    }
    this.store.doctorSpecialties = this.store.doctorSpecialties.filter(
      (ds) => ds.specialtyId !== id,
    );
    this.store.specialties = this.store.specialties.filter((s) => s.id !== id);
  }
}
