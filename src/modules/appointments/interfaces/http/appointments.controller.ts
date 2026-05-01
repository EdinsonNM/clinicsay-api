import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateAppointmentUseCase } from '../../application/use-cases/create-appointment.use-case';
import { GetAppointmentDetailUseCase } from '../../application/use-cases/get-appointment-detail.use-case';
import { ListAppointmentsForCalendarUseCase } from '../../application/use-cases/list-appointments-for-calendar.use-case';
import { AppointmentProjectionParser } from '../../application/projection/appointment-projection.parser';
import { ListAppointmentsQueryParser } from '../../application/queries/list-appointments.query';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentResponseDto } from './dto/appointment-response.dto';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly listCalendar: ListAppointmentsForCalendarUseCase,
    private readonly createAppointment: CreateAppointmentUseCase,
    private readonly getDetail: GetAppointmentDetailUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ type: AppointmentResponseDto })
  @ApiBadRequestResponse()
  @ApiQuery({ name: 'date', required: false, example: '2026-05-15' })
  @ApiQuery({ name: 'from', required: false, example: '2026-05-01' })
  @ApiQuery({ name: 'to', required: false, example: '2026-05-31' })
  @ApiQuery({ name: 'doctorId', required: false, example: 'd-44' })
  @ApiQuery({ name: 'patientId', required: false, example: 'p-99' })
  @ApiQuery({ name: 'specialtyId', required: false, example: 's-1' })
  @ApiQuery({
    name: 'include',
    required: false,
    example: 'patient,doctor.specialty',
  })
  @ApiQuery({
    name: 'fields[appointments]',
    required: false,
    example: 'date,status,reason',
  })
  @ApiQuery({
    name: 'fields[patients]',
    required: false,
    example: 'fullName,dni,email,phone,address',
  })
  @ApiQuery({ name: 'fields[doctors]', required: false, example: 'name,cmp' })
  @ApiQuery({ name: 'fields[specialties]', required: false, example: 'name' })
  list(@Req() request: Request) {
    return this.listCalendar.execute(
      ListAppointmentsQueryParser.parse(request.query),
    );
  }

  @Post()
  @ApiCreatedResponse({ type: AppointmentResponseDto })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  create(@Body() body: CreateAppointmentDto) {
    return this.createAppointment.execute(body);
  }

  @Get(':id')
  @ApiOkResponse({ type: AppointmentResponseDto })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiQuery({
    name: 'include',
    required: false,
    example: 'patient,doctor.specialty',
  })
  @ApiQuery({
    name: 'fields[appointments]',
    required: false,
    example: 'date,status',
  })
  @ApiQuery({
    name: 'fields[patients]',
    required: false,
    example: 'fullName,dni,email,phone,address',
  })
  @ApiQuery({ name: 'fields[doctors]', required: false, example: 'name' })
  @ApiQuery({ name: 'fields[specialties]', required: false, example: 'name' })
  detail(@Param('id') id: string, @Req() request: Request) {
    return this.getDetail.execute({
      id,
      projection: AppointmentProjectionParser.parse(request.query),
    });
  }
}
