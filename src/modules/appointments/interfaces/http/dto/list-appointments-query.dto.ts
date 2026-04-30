import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class ListAppointmentsQueryDto {
  @ApiProperty({ example: '2026-05-01' })
  @IsDateString()
  from!: string;

  @ApiProperty({ example: '2026-05-31' })
  @IsDateString()
  to!: string;
}
