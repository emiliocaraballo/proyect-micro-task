import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { TeamMemberType } from 'src/model/teams/role.enum';
export class CreateTeamDto {
  @ApiProperty()
  name: string;
}

export class AddMemberDto {
  @ApiProperty()
  @IsNumber()
  @ApiProperty()
  userId: number;

  @ApiProperty()
  @IsEnum(TeamMemberType)
  @ApiProperty()
  role: TeamMemberType;
}
