import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'service-commons/dist';

export class UserRegisterDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  rol: Role.admin | Role.member;
}

export class UserUpdateDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  rol: Role.admin | Role.member | Role.viewer;
}

export class RegisterResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  rol?: Role.admin | Role.member | Role.viewer;
}
