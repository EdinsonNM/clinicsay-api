import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DemoClinicStore } from '../../shared/demo-clinic.store';

@Injectable()
export class SearchPatientsUseCase {
  constructor(
    private readonly store: DemoClinicStore,
    private readonly prisma: PrismaService,
  ) {}

  async execute(search = '') {
    const term = search.toLowerCase();
    if (this.prisma.isEnabled) {
      const patients = await this.prisma.db.patient.findMany({
        where: {
          OR: [
            { fullName: { contains: search, mode: 'insensitive' } },
            { dni: { contains: search, mode: 'insensitive' } },
          ],
        },
        select: { id: true, fullName: true, dni: true },
        orderBy: { fullName: 'asc' },
        take: 20,
      });
      return { data: patients };
    }

    return {
      data: this.store.patients
        .filter(
          (patient) =>
            patient.fullName.toLowerCase().includes(term) ||
            patient.dni.toLowerCase().includes(term),
        )
        .map(({ id, fullName, dni }) => ({ id, fullName, dni })),
    };
  }
}
