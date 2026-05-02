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
  Req,
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
import type { Request } from 'express';
import { DoctorProjectionParser } from '../../application/projection/doctor-projection.parser';
import { ListDoctorsQueryParser } from '../../application/queries/list-doctors.query';
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
  @ApiQuery({
    name: 'include',
    required: false,
    example: 'specialties',
    description:
      'Solo listado: specialties. Respuesta JSON:API con data + included opcional.',
  })
  @ApiQuery({
    name: 'fields[doctors]',
    required: false,
    example: 'name,cmp,specialtyIds',
  })
  @ApiQuery({
    name: 'fields[specialties]',
    required: false,
    example: 'name',
  })
  @ApiOkResponse({
    description:
      'JSON:API: data[] doctores; include=specialties agrega especialidades en included',
  })
  @ApiBadRequestResponse()
  list(@Req() request: Request) {
    return this.listDoctors.execute(
      ListDoctorsQueryParser.parse(request.query as Record<string, unknown>),
    );
  }

  @Post()
  @ApiCreatedResponse({ type: DoctorItemDto })
  @ApiBadRequestResponse()
  @ApiConflictResponse({ description: 'CMP duplicado' })
  create(@Body() body: CreateDoctorDto) {
    return this.createDoctor.execute(body);
  }

  @Get(':id')
  @ApiQuery({
    name: 'include',
    required: false,
    example: 'specialties,appointments.upcoming,appointments.history',
    description:
      'Sin este param: por defecto incluye specialties + citas proximas + historial. Vacio explicito (?include=): sin relaciones.',
  })
  @ApiQuery({
    name: 'fields[doctors]',
    required: false,
    example: 'name,cmp,specialtyIds',
  })
  @ApiQuery({
    name: 'fields[specialties]',
    required: false,
    example: 'name',
  })
  @ApiQuery({
    name: 'fields[appointments]',
    required: false,
    example: 'date,status,reason',
  })
  @ApiQuery({
    name: 'fields[patients]',
    required: false,
    example: 'fullName,dni',
  })
  @ApiOkResponse({
    description:
      'JSON:API doctor en data; relaciones upcomingAppointments / historicalAppointments; included con appointments, patients, specialties',
  })
  @ApiNotFoundResponse()
  detail(@Param('id') id: string, @Req() request: Request) {
    return this.getDoctor.execute({
      id,
      projection: DoctorProjectionParser.parseDetailQuery(
        request.query as Record<string, unknown>,
      ),
    });
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
