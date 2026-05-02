import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateDoctorDto {
  @ApiProperty({ example: 'Dr. Mendoza' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'CMP999' })
  @IsString()
  @MinLength(3)
  cmp!: string;

  @ApiProperty({ example: ['s-1'], type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  specialtyIds!: string[];
}
