import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'service-commons/dist';
export class loginPayloadDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;

  @ApiProperty()
  rol?: Role.admin | Role.member | Role.viewer;
}

export class refreshTokenPayloadDto {
  @ApiProperty()
  refreshToken: string;
}

export class loginResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
