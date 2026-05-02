import { ApiProperty } from '@nestjs/swagger';

export class DoctorItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  cmp!: string;

  @ApiProperty({ type: [String] })
  specialtyIds!: string[];
}
