import { Inject, Injectable } from '@nestjs/common';
import { SPECIALTY_REPOSITORY } from './ports/specialty.repository';
import type { SpecialtyRepository } from './ports/specialty.repository';

@Injectable()
export class ListSpecialtiesUseCase {
  constructor(
    @Inject(SPECIALTY_REPOSITORY)
    private readonly specialties: SpecialtyRepository,
  ) {}

  async execute() {
    const data = await this.specialties.list();
    return { data };
  }
}
