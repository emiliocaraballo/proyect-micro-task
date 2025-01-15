import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  Request,
  BadRequestException,
  UsePipes,
  HttpStatus,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  AssignTaskDto,
  CreateTaskDto,
  GetAllTaskDto,
  GetTeamsTasksDto,
  GetUsersTasksDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
} from './tasks.dto';
import { IRequest, JoiValidationPipe } from 'service-commons/dist';
import { ManyRolesAuth, Role } from 'service-commons/dist';
import to from 'await-to-js';
import {
  taskAssignSchema,
  taskCreateSchema,
  taskUpdateSchema,
  taskUpdateStatusSchema,
} from './joiSchema';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatedTaskCommand } from './commands/create-task.command';
import { UpdatedTaskCommand } from './commands/update-task-command';
import { GetAllTaskQuery } from './queries/get-all-task.query';
import { GetTeamsTaskQuery } from './queries/get-teams-task.query';
import { GetUsersTaskQuery } from './queries/get-users-task.query';
import { GetDetailTaskQuery } from './queries/get-detail-task.query';
import { UpdateStatusTaskCommand } from './commands/update-status-task.command';
import { AssignTaskCommand } from './commands/assign-task.command';
import { DeleteTaskCommand } from './commands/delete-task.command';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('create')
  @ManyRolesAuth([Role.admin, Role.member])
  @UsePipes(new JoiValidationPipe(taskCreateSchema))
  async create(@Body() body: CreateTaskDto, @Request() req: IRequest) {
    const [error, response] = await to(
      this.commandBus.execute(
        new CreatedTaskCommand(
          body.title,
          body.description,
          body.deadline,
          body.status,
          req.user.sub,
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
  @ApiResponse({
    status: HttpStatus.OK,
    type: [GetAllTaskDto],
  })
  async findAll() {
    const [error, response] = await to(
      this.queryBus.execute(new GetAllTaskQuery()),
    );
    if (error) {
      throw new BadRequestException(error);
    }

    return response;
  }

  @Get('team/:teamId/all')
  @ManyRolesAuth([Role.admin, Role.member, Role.viewer])
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetTeamsTasksDto,
  })
  async findAllByTeam(@Param('teamId') teamId: number) {
    const [error, response] = await to(
      this.queryBus.execute(new GetTeamsTaskQuery(teamId)),
    );
    if (error) {
      throw new BadRequestException(error);
    }

    return response;
  }

  @Get('user/:userId/all')
  @ManyRolesAuth([Role.admin, Role.member, Role.viewer])
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUsersTasksDto,
  })
  async findAllByUser(@Param('userId') userId: number) {
    const [error, response] = await to(
      this.queryBus.execute(new GetUsersTaskQuery(userId)),
    );
    if (error) {
      throw new BadRequestException(error);
    }

    return response;
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAllTaskDto,
  })
  @ManyRolesAuth([Role.admin, Role.member, Role.viewer])
  async findOne(@Param('id') id: number) {
    const [error, response] = await to(
      this.queryBus.execute(new GetDetailTaskQuery(id)),
    );
    if (error) {
      throw new BadRequestException(error);
    }

    return response;
  }

  @Patch(':id/status')
  @ManyRolesAuth([Role.admin, Role.member])
  @UsePipes(new JoiValidationPipe(taskUpdateStatusSchema))
  async updateStatus(
    @Param('id') id: number,
    @Body() body: UpdateTaskStatusDto,
    @Request() req: IRequest,
  ) {
    const [error, response] = await to(
      this.commandBus.execute(
        new UpdateStatusTaskCommand(id, body.status, req.user.sub),
      ),
    );
    if (error) {
      throw new BadRequestException(error);
    }
    return response;
  }

  @Patch(':id/assign')
  @ManyRolesAuth([Role.admin, Role.member])
  @UsePipes(new JoiValidationPipe(taskAssignSchema))
  async assign(
    @Param('id') id: number,
    @Body() body: AssignTaskDto,
    @Request() req: IRequest,
  ) {
    const [error, response] = await to(
      this.commandBus.execute(
        new AssignTaskCommand(id, body.userId, body.teamId, req.user.sub),
      ),
    );
    if (error) {
      throw new BadRequestException(error);
    }
    return response;
  }

  @Put('update/:id')
  @ManyRolesAuth([Role.admin, Role.member])
  @UsePipes(new JoiValidationPipe(taskUpdateSchema))
  async update(
    @Param('id') id: number,
    @Body() body: UpdateTaskDto,
    @Request() req: IRequest,
  ) {
    const [error, response] = await to(
      this.commandBus.execute(
        new UpdatedTaskCommand(
          id,
          body.title,
          body.description,
          body.deadline,
          body.status,
          req.user.sub,
        ),
      ),
    );
    if (error) {
      throw new BadRequestException(error);
    }
    return response;
  }

  @Delete(':id')
  @ManyRolesAuth([Role.admin])
  async remove(@Param('id') id: number, @Request() req: IRequest) {
    const [error, response] = await to(
      this.commandBus.execute(new DeleteTaskCommand(id, req.user.sub)),
    );
    if (error) {
      throw new BadRequestException(error);
    }
    return response;
  }
}
