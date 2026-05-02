import { Inject, Injectable } from '@nestjs/common';
import { SPECIALTY_REPOSITORY } from '../ports/specialty.repository';
import type { SpecialtyRepository } from '../ports/specialty.repository';

@Injectable()
export class CreateSpecialtyUseCase {
  constructor(
    @Inject(SPECIALTY_REPOSITORY)
    private readonly specialties: SpecialtyRepository,
  ) {}

  async execute(input: { name: string }) {
    const row = await this.specialties.create(input);
    return { data: row };
  }
}
