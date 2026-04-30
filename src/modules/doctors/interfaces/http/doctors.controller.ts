import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ListDoctorsBySpecialtyUseCase } from '../../application/list-doctors-by-specialty.use-case';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly listDoctors: ListDoctorsBySpecialtyUseCase) {}

  @Get()
  @ApiQuery({ name: 'specialtyId', required: true })
  @ApiOkResponse({ description: 'Doctores asociados a la especialidad' })
  @ApiBadRequestResponse()
  list(@Query('specialtyId') specialtyId: string) {
    return this.listDoctors.execute(specialtyId);
  }
}
