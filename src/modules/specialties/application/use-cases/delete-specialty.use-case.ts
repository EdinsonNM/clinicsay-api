import { Inject, Injectable } from '@nestjs/common';
import { SPECIALTY_REPOSITORY } from '../ports/specialty.repository';
import type { SpecialtyRepository } from '../ports/specialty.repository';

@Injectable()
export class DeleteSpecialtyUseCase {
  constructor(
    @Inject(SPECIALTY_REPOSITORY)
    private readonly specialties: SpecialtyRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.specialties.delete(id);
  }
}
