import { ApiProperty } from '@nestjs/swagger';

export class AppointmentResponseDto {
  @ApiProperty()
  data!: unknown;

  @ApiProperty({ required: false })
  included?: unknown[];
}
