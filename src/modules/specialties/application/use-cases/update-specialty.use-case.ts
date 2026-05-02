import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { SPECIALTY_REPOSITORY } from '../ports/specialty.repository';
import type { SpecialtyRepository } from '../ports/specialty.repository';

@Injectable()
export class UpdateSpecialtyUseCase {
  constructor(
    @Inject(SPECIALTY_REPOSITORY)
    private readonly specialties: SpecialtyRepository,
  ) {}

  async execute(id: string, input: { name?: string }) {
    if (input.name === undefined) {
      throw new BadRequestException('No hay cambios para aplicar');
    }
    const row = await this.specialties.update(id, { name: input.name });
    return { data: row };
  }
}
