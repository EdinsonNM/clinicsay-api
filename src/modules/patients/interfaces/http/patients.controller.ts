import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SearchPatientsUseCase } from '../../application/search-patients.use-case';

@ApiTags('Patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly searchPatients: SearchPatientsUseCase) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiOkResponse({
    description: 'Pacientes encontrados con proyeccion publica',
  })
  search(@Query('search') search?: string) {
    return this.searchPatients.execute(search);
  }
}
