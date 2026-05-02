import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateDoctorDto {
  @ApiPropertyOptional({ example: 'Dr. Mendoza Ruiz' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({ example: 'CMP999' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  cmp?: string;

  @ApiPropertyOptional({ example: ['s-1', 's-2'], type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  specialtyIds?: string[];
}
