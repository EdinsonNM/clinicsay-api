import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ListSpecialtiesUseCase } from '../../application/list-specialties.use-case';

@ApiTags('Specialties')
@Controller('specialties')
export class SpecialtiesController {
  constructor(private readonly listSpecialties: ListSpecialtiesUseCase) {}

  @Get()
  @ApiOkResponse({ description: 'Especialidades disponibles' })
  list() {
    return this.listSpecialties.execute();
  }
}
