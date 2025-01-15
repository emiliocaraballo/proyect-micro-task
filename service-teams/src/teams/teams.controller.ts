import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { AddMemberDto, CreateTeamDto } from './teams.dto';
import {
  IRequest,
  JoiValidationPipe,
  ManyRolesAuth,
  Role,
} from 'service-commons/dist';
import to from 'await-to-js';
// import { EventPattern } from '@nestjs/microservices';
import {
  teamCreateSchema,
  teamMemberSchema,
  teamUpdateSchema,
} from './joiSchema';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatedTeamCommand } from './commands/create-team-command';
import { UpdateTeamCommand } from './commands/update-team-command';
import { GetAllTeamQuery } from './queries/get-all-team.query';
import { AddMemberTeamCommand } from './commands/add-member-team.command';
import { EventPattern } from '@nestjs/microservices';
import { GetTeamsQuery } from './queries/get-teams.query';

@Controller('teams')
export class TeamsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('create')
  @ManyRolesAuth([Role.admin])
  @UsePipes(new JoiValidationPipe(teamCreateSchema))
  async create(@Body() createTeamDto: CreateTeamDto, @Request() req: IRequest) {
    const [error, response] = await to(
      this.commandBus.execute(
        new CreatedTeamCommand(createTeamDto.name, req.user.sub),
      ),
    );
    if (error) {
      throw new BadRequestException(error);
    }
    return response;
  }

  @Put('update/:id')
  @ManyRolesAuth([Role.admin])
  @UsePipes(new JoiValidationPipe(teamUpdateSchema))
  async update(
    @Param('id') id: number,
    @Body() updateTeamDto: CreateTeamDto,
    @Request() req: IRequest,
  ) {
    const [error, response] = await to(
      this.commandBus.execute(
        new UpdateTeamCommand(id, updateTeamDto.name, req.user.sub),
      ),
    );
    if (error) {
      throw new BadRequestException(error);
    }
    return response;
  }

  @Post(':id/members')
  @ManyRolesAuth([Role.admin])
  @UsePipes(new JoiValidationPipe(teamMemberSchema))
  async addMember(
    @Param('id') id: number,
    @Body() addMemberDto: AddMemberDto,
    @Request() req: IRequest,
  ) {
    const [error, response] = await to(
      this.commandBus.execute(
        new AddMemberTeamCommand(
          id,
          addMemberDto.userId,
          addMemberDto.role,
          req.user,
        ),
      ),
    );
    if (error) {
      throw new BadRequestException(error);
    }
    return response;
  }

  @Get('all')
  @ManyRolesAuth([Role.admin, Role.member, Role.viewer])
  async findAll() {
    const [error, response] = await to(
      this.queryBus.execute(new GetAllTeamQuery()),
    );
    if (error) {
      throw new BadRequestException(error);
    }

    return response;
  }

  // Evento para obtener información de varios equipos
  @EventPattern('getTeamInfoIds')
  async getTeamInfoIds(body: any) {
    const [error, response] = await to(
      this.queryBus.execute(new GetTeamsQuery(body.ids)),
    );
    if (error) {
      throw new UnauthorizedException(error);
    }
    return response;
  }
}
