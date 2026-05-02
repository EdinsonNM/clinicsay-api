import { Module } from '@nestjs/common';
import { DemoClinicModule } from '../shared/demo-clinic.module';
import { ListSpecialtiesUseCase } from './application/list-specialties.use-case';
import { SPECIALTY_REPOSITORY } from './application/ports/specialty.repository';
import { CreateSpecialtyUseCase } from './application/use-cases/create-specialty.use-case';
import { DeleteSpecialtyUseCase } from './application/use-cases/delete-specialty.use-case';
import { GetSpecialtyUseCase } from './application/use-cases/get-specialty.use-case';
import { UpdateSpecialtyUseCase } from './application/use-cases/update-specialty.use-case';
import { PrismaSpecialtyRepository } from './infrastructure/prisma/prisma-specialty.repository';
import { SpecialtiesController } from './interfaces/http/specialties.controller';

@Module({
  imports: [DemoClinicModule],
  controllers: [SpecialtiesController],
  providers: [
    ListSpecialtiesUseCase,
    GetSpecialtyUseCase,
    CreateSpecialtyUseCase,
    UpdateSpecialtyUseCase,
    DeleteSpecialtyUseCase,
    {
      provide: SPECIALTY_REPOSITORY,
      useClass: PrismaSpecialtyRepository,
    },
  ],
})
export class SpecialtiesModule {}
