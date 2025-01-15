import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from 'src/tasks/tasks.controller';
import { TaskEntity } from 'src/model/task/task.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTaskHandler } from 'src/tasks/commands/handlers/create-task.handler';
import { UpdateTaskHandler } from 'src/tasks/commands/handlers/update-task.handler';
import { UpdateStatusTaskHandler } from 'src/tasks/commands/handlers/update-status-task.handler';
import { TaskCreatedHandler } from 'src/tasks/events/handlers/task-created.handler';
import { TaskUpdatedHandler } from 'src/tasks/events/handlers/task-updated.handler';
import { TaskStatusUpdatedHandler } from 'src/tasks/events/handlers/task-status-updated.handler';
import { AssignTaskHandler } from 'src/tasks/commands/handlers/assign-task.handler';
import { DeleteTaskHandler } from 'src/tasks/commands/handlers/delete-task.handler';
import { TaskAssignHandler } from 'src/tasks/events/handlers/task-assign.handler';
import { TaskDeleteHandler } from 'src/tasks/events/handlers/task-delete.handler';
import { GetAllTaskHandler } from 'src/tasks/queries/handlers/get-all-task.handler';
import { GetDetailTaskHandler } from 'src/tasks/queries/handlers/get-detail-task.handler';
import { GetAllTeamHandler } from './queries/handlers/get-teams-task.handler';
import { GetUsersTaskHandler } from './queries/handlers/get-users-task.handler';
import {
  TaskEvent,
  TaskEventSchema,
} from 'src/model/schema/tasks-event.schema';
import { GetUserSHandler } from 'src/tasks/queries/handlers/get-users.handler';
import { GetTeamsSHandler } from 'src/tasks/queries/handlers/get-teams.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity]),
    JwtModule.register({
      secret: process.env.API_TOKEN_KEY_VALUE,
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
      { name: TaskEvent.name, schema: TaskEventSchema },
    ]),
    CqrsModule,
    // ClientsModule.register([
    //   {
    //     name: 'API_MICROSERVICE_TRANSFER',
    //     transport: Transport.REDIS,
    //     options: {
    //       host: process.env.REDIS_HOST,
    //       port: Number(process.env.REDIS_PORT),
    //     },
    //   },
    // ]),
  ],
  controllers: [TasksController],
  providers: [
    CreateTaskHandler,
    TaskCreatedHandler,

    UpdateTaskHandler,
    TaskUpdatedHandler,

    UpdateStatusTaskHandler,
    TaskStatusUpdatedHandler,

    AssignTaskHandler,
    TaskAssignHandler,

    DeleteTaskHandler,
    TaskDeleteHandler,

    GetAllTaskHandler,
    GetDetailTaskHandler,
    GetAllTeamHandler,
    GetUsersTaskHandler,
    GetUserSHandler,
    GetTeamsSHandler,
  ],
})
export class TasksModule {}
