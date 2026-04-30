import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
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
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ListAppointmentsQueryDto } from './dto/list-appointments-query.dto';
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
  list(@Query() query: ListAppointmentsQueryDto) {
    return this.listCalendar.execute(query.from, query.to);
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
    example: 'fullName,dni',
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
