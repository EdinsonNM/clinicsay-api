import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetAppointmentDetailQueryDto {
  @ApiPropertyOptional({ example: 'patient,doctor.specialty' })
  @IsOptional()
  @IsString()
  include?: string;
}
