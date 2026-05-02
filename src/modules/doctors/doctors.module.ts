import { Module } from '@nestjs/common';
import { DemoClinicModule } from '../shared/demo-clinic.module';
import { DOCTOR_READ_REPOSITORY } from './application/ports/doctor-read.repository';
import { DOCTOR_REPOSITORY } from './application/ports/doctor.repository';
import { CreateDoctorUseCase } from './application/use-cases/create-doctor.use-case';
import { DeleteDoctorUseCase } from './application/use-cases/delete-doctor.use-case';
import { GetDoctorUseCase } from './application/use-cases/get-doctor.use-case';
import { ListDoctorsUseCase } from './application/use-cases/list-doctors.use-case';
import { UpdateDoctorUseCase } from './application/use-cases/update-doctor.use-case';
import { PrismaDoctorReadRepository } from './infrastructure/prisma/prisma-doctor-read.repository';
import { PrismaDoctorRepository } from './infrastructure/prisma/prisma-doctor.repository';
import { DoctorsController } from './interfaces/http/doctors.controller';

@Module({
  imports: [DemoClinicModule],
  controllers: [DoctorsController],
  providers: [
    ListDoctorsUseCase,
    GetDoctorUseCase,
    CreateDoctorUseCase,
    UpdateDoctorUseCase,
    DeleteDoctorUseCase,
    {
      provide: DOCTOR_REPOSITORY,
      useClass: PrismaDoctorRepository,
    },
    {
      provide: DOCTOR_READ_REPOSITORY,
      useClass: PrismaDoctorReadRepository,
    },
  ],
})
export class DoctorsModule {}
