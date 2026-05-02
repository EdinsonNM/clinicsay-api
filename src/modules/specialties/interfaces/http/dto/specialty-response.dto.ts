import { ApiProperty } from '@nestjs/swagger';

export class SpecialtyItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;
}
