import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateDoctorUseCase } from '../../application/use-cases/create-doctor.use-case';
import { DeleteDoctorUseCase } from '../../application/use-cases/delete-doctor.use-case';
import { GetDoctorUseCase } from '../../application/use-cases/get-doctor.use-case';
import { ListDoctorsUseCase } from '../../application/use-cases/list-doctors.use-case';
import { UpdateDoctorUseCase } from '../../application/use-cases/update-doctor.use-case';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorItemDto } from './dto/doctor-response.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(
    private readonly listDoctors: ListDoctorsUseCase,
    private readonly getDoctor: GetDoctorUseCase,
    private readonly createDoctor: CreateDoctorUseCase,
    private readonly updateDoctor: UpdateDoctorUseCase,
    private readonly deleteDoctor: DeleteDoctorUseCase,
  ) {}

  @Get()
  @ApiQuery({
    name: 'specialtyId',
    required: false,
    description: 'Si se envia, solo doctores con esa especialidad',
  })
  @ApiOkResponse({ description: 'Lista en { data: DoctorItemDto[] }' })
  @ApiBadRequestResponse()
  list(@Query('specialtyId') specialtyId?: string) {
    return this.listDoctors.execute(specialtyId);
  }

  @Post()
  @ApiCreatedResponse({ type: DoctorItemDto })
  @ApiBadRequestResponse()
  @ApiConflictResponse({ description: 'CMP duplicado' })
  create(@Body() body: CreateDoctorDto) {
    return this.createDoctor.execute(body);
  }

  @Get(':id')
  @ApiOkResponse({ type: DoctorItemDto })
  @ApiNotFoundResponse()
  detail(@Param('id') id: string) {
    return this.getDoctor.execute(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: DoctorItemDto })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'CMP duplicado' })
  update(@Param('id') id: string, @Body() body: UpdateDoctorDto) {
    return this.updateDoctor.execute(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'Citas asociadas' })
  remove(@Param('id') id: string) {
    return this.deleteDoctor.execute(id);
  }
}
