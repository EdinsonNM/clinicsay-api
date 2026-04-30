import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { PatientsModule } from './modules/patients/patients.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { SpecialtiesModule } from './modules/specialties/specialties.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AppointmentsModule,
    PatientsModule,
    DoctorsModule,
    SpecialtiesModule,
  ],
})
export class AppModule {}
