import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DemoClinicStore } from '../../shared/demo-clinic.store';

@Injectable()
export class ListDoctorsBySpecialtyUseCase {
  constructor(
    private readonly store: DemoClinicStore,
    private readonly prisma: PrismaService,
  ) {}

  async execute(specialtyId: string) {
    if (!specialtyId) throw new BadRequestException('specialtyId es requerido');
    if (this.prisma.isEnabled) {
      const relations = await this.prisma.db.doctorSpecialty.findMany({
        where: { specialtyId },
        include: { doctor: true },
        orderBy: { doctor: { name: 'asc' } },
      });
      return {
        data: relations.map(({ doctor }) => ({
          id: doctor.id,
          name: doctor.name,
          cmp: doctor.cmp,
        })),
      };
    }

    const doctorIds = new Set(
      this.store.doctorSpecialties
        .filter((item) => item.specialtyId === specialtyId)
        .map((item) => item.doctorId),
    );
    return {
      data: this.store.doctors
        .filter((doctor) => doctorIds.has(doctor.id))
        .map(({ id, name, cmp }) => ({ id, name, cmp })),
    };
  }
}
