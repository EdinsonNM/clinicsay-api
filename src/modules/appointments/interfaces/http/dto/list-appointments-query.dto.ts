import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListAppointmentsQueryDto {
  @ApiPropertyOptional({ example: '2026-05-15' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ example: '2026-05-01' })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional({ example: '2026-05-31' })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiPropertyOptional({ example: 'd-44' })
  @IsOptional()
  @IsString()
  doctorId?: string;

  @ApiPropertyOptional({ example: 'p-99' })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiPropertyOptional({ example: 's-1' })
  @IsOptional()
  @IsString()
  specialtyId?: string;

  @ApiPropertyOptional({ example: 'patient,doctor.specialty' })
  @IsOptional()
  @IsString()
  include?: string;
}
