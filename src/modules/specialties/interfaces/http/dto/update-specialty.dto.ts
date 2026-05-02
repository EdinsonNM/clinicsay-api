import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateSpecialtyDto {
  @ApiPropertyOptional({ example: 'Traumatologia pediatrica' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;
}
