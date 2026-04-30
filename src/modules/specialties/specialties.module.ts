import { Module } from '@nestjs/common';
import { DemoClinicModule } from '../shared/demo-clinic.module';
import { ListSpecialtiesUseCase } from './application/list-specialties.use-case';
import { SpecialtiesController } from './interfaces/http/specialties.controller';

@Module({
  imports: [DemoClinicModule],
  controllers: [SpecialtiesController],
  providers: [ListSpecialtiesUseCase],
})
export class SpecialtiesModule {}
