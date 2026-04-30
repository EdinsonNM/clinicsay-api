import { Module } from '@nestjs/common';
import { DemoClinicModule } from '../shared/demo-clinic.module';
import { CreatePatientIfNeededUseCase } from './application/create-patient-if-needed.use-case';
import { SearchPatientsUseCase } from './application/search-patients.use-case';
import { PatientsController } from './interfaces/http/patients.controller';

@Module({
  imports: [DemoClinicModule],
  controllers: [PatientsController],
  providers: [SearchPatientsUseCase, CreatePatientIfNeededUseCase],
  exports: [CreatePatientIfNeededUseCase],
})
export class PatientsModule {}
