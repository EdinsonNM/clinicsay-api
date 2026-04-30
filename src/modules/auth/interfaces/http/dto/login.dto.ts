import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  @MinLength(1)
  username!: string;

  @ApiProperty({ example: 'admin' })
  @IsString()
  @MinLength(1)
  password!: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'dummy-admin-token' })
  token!: string;

  @ApiProperty({
    example: { id: 'admin-1', role: 'admin', name: 'Administrador ClinicSay' },
  })
  user!: { id: string; role: 'admin'; name: string };
}
