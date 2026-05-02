import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateSpecialtyDto {
  @ApiProperty({ example: 'Traumatologia' })
  @IsString()
  @MinLength(2)
  name!: string;
}
