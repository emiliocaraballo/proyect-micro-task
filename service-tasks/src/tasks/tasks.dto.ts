import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsIn,
  IsNumber,
} from 'class-validator';
import { TaskStatus } from 'src/model/task/task.enum';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  deadline?: Date;

  @ApiProperty()
  @IsOptional()
  @IsIn(['to_do', 'doing', 'done'])
  status?: TaskStatus;
}

export class UpdateTaskDto extends CreateTaskDto {}

export class UpdateTaskStatusDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: TaskStatus;
}

export class AssignTaskDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  teamId?: number;
}

export class GetUserInfoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  rol: string;
}

export class GetAllTaskDto {
  id: number;
  title: string;
  description: string;
  deadline: Date;
  status: TaskStatus;
  assignedTo: number;
}

export class GetTeamInfoDto {
  id: number;
  name: string;
}

export class GetUsersTasksDto {
  user: GetUserInfoDto;
  tasks: GetAllTaskDto[];
}

export class GetTeamsTasksDto {
  team: GetTeamInfoDto;
  tasks: GetAllTaskDto[];
}
