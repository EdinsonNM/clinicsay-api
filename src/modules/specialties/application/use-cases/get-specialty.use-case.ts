import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SPECIALTY_REPOSITORY } from '../ports/specialty.repository';
import type { SpecialtyRepository } from '../ports/specialty.repository';

@Injectable()
export class GetSpecialtyUseCase {
  constructor(
    @Inject(SPECIALTY_REPOSITORY)
    private readonly specialties: SpecialtyRepository,
  ) {}

  async execute(id: string) {
    const row = await this.specialties.findById(id);
    if (!row) throw new NotFoundException('Especialidad no encontrada');
    return { data: row };
  }
}
