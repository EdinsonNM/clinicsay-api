import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class NewPatientDto {
  @ApiProperty({ example: 'Juan Perez' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: '12345678A' })
  @IsString()
  dni!: string;
}

export class CreateAppointmentDto {
  @ApiProperty({ example: '2026-05-15T10:00:00.000Z' })
  @IsDateString()
  date!: string;

  @ApiProperty({ example: 'd-44' })
  @IsString()
  doctorId!: string;

  @ApiProperty({ example: 's-1' })
  @IsString()
  specialtyId!: string;

  @ApiPropertyOptional({ example: 'p-99' })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiPropertyOptional({ type: NewPatientDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => NewPatientDto)
  patient?: NewPatientDto;

  @ApiPropertyOptional({ example: 'Consulta cardiologica' })
  @IsOptional()
  @IsString()
  reason?: string;
}
