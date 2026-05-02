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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ListSpecialtiesUseCase } from '../../application/list-specialties.use-case';
import { CreateSpecialtyUseCase } from '../../application/use-cases/create-specialty.use-case';
import { DeleteSpecialtyUseCase } from '../../application/use-cases/delete-specialty.use-case';
import { GetSpecialtyUseCase } from '../../application/use-cases/get-specialty.use-case';
import { UpdateSpecialtyUseCase } from '../../application/use-cases/update-specialty.use-case';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { SpecialtyItemDto } from './dto/specialty-response.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';

@ApiTags('Specialties')
@Controller('specialties')
export class SpecialtiesController {
  constructor(
    private readonly listSpecialties: ListSpecialtiesUseCase,
    private readonly getSpecialty: GetSpecialtyUseCase,
    private readonly createSpecialty: CreateSpecialtyUseCase,
    private readonly updateSpecialty: UpdateSpecialtyUseCase,
    private readonly deleteSpecialty: DeleteSpecialtyUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ description: 'Lista en { data: SpecialtyItemDto[] }' })
  list() {
    return this.listSpecialties.execute();
  }

  @Post()
  @ApiCreatedResponse({ type: SpecialtyItemDto })
  @ApiBadRequestResponse()
  @ApiConflictResponse({ description: 'Nombre duplicado' })
  create(@Body() body: CreateSpecialtyDto) {
    return this.createSpecialty.execute(body);
  }

  @Get(':id')
  @ApiOkResponse({ type: SpecialtyItemDto })
  @ApiNotFoundResponse()
  detail(@Param('id') id: string) {
    return this.getSpecialty.execute(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: SpecialtyItemDto })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'Nombre duplicado' })
  update(@Param('id') id: string, @Body() body: UpdateSpecialtyDto) {
    return this.updateSpecialty.execute(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'Citas asociadas' })
  remove(@Param('id') id: string) {
    return this.deleteSpecialty.execute(id);
  }
}
