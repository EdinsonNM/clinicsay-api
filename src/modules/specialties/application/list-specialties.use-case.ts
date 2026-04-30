import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DemoClinicStore } from '../../shared/demo-clinic.store';

@Injectable()
export class ListSpecialtiesUseCase {
  constructor(
    private readonly store: DemoClinicStore,
    private readonly prisma: PrismaService,
  ) {}

  async execute() {
    if (this.prisma.isEnabled) {
      const specialties = await this.prisma.db.specialty.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      });
      return { data: specialties };
    }

    return {
      data: this.store.specialties.map(({ id, name }) => ({ id, name })),
    };
  }
}
