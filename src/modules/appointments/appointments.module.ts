import { Module } from '@nestjs/common';
import { DemoClinicModule } from '../shared/demo-clinic.module';
import { AppointmentsController } from './interfaces/http/appointments.controller';
import { GetAppointmentDetailUseCase } from './application/use-cases/get-appointment-detail.use-case';
import { ListAppointmentsForCalendarUseCase } from './application/use-cases/list-appointments-for-calendar.use-case';
import { CreateAppointmentUseCase } from './application/use-cases/create-appointment.use-case';
import { APPOINTMENT_READ_REPOSITORY } from './application/ports/appointment-read.repository';
import { PrismaAppointmentReadRepository } from './infrastructure/prisma/prisma-appointment-read.repository';
import { APPOINTMENT_CALENDAR_REPOSITORY } from './application/ports/appointment-calendar.repository';
import { PrismaAppointmentCalendarRepository } from './infrastructure/prisma/prisma-appointment-calendar.repository';
import { APPOINTMENT_WRITE_REPOSITORY } from './application/ports/appointment-write.repository';
import { PrismaAppointmentWriteRepository } from './infrastructure/prisma/prisma-appointment-write.repository';

@Module({
  imports: [DemoClinicModule],
  controllers: [AppointmentsController],
  providers: [
    GetAppointmentDetailUseCase,
    ListAppointmentsForCalendarUseCase,
    CreateAppointmentUseCase,
    {
      provide: APPOINTMENT_READ_REPOSITORY,
      useClass: PrismaAppointmentReadRepository,
    },
    {
      provide: APPOINTMENT_CALENDAR_REPOSITORY,
      useClass: PrismaAppointmentCalendarRepository,
    },
    {
      provide: APPOINTMENT_WRITE_REPOSITORY,
      useClass: PrismaAppointmentWriteRepository,
    },
  ],
})
export class AppointmentsModule {}
