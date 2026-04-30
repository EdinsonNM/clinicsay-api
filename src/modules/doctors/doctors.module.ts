import { Module } from '@nestjs/common';
import { DemoClinicModule } from '../shared/demo-clinic.module';
import { ListDoctorsBySpecialtyUseCase } from './application/list-doctors-by-specialty.use-case';
import { DoctorsController } from './interfaces/http/doctors.controller';

@Module({
  imports: [DemoClinicModule],
  controllers: [DoctorsController],
  providers: [ListDoctorsBySpecialtyUseCase],
})
export class DoctorsModule {}
