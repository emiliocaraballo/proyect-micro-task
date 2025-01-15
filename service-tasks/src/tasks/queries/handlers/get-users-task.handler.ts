import { Repository } from 'typeorm';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/model/task/task.entity';
import { GetUsersTaskQuery } from 'src/tasks/queries/get-users-task.query';
import { GetUsersTasksDto } from 'src/tasks/tasks.dto';
import { GetUsersQuery } from 'src/tasks/queries/get-users.query';
import to from 'await-to-js';
import { customThrowError } from 'service-commons/dist';

@QueryHandler(GetUsersTaskQuery)
export class GetUsersTaskHandler implements IQueryHandler<GetUsersTaskQuery> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(body: GetUsersTaskQuery): Promise<GetUsersTasksDto> {
    const [, resultUser] = await to(
      this.queryBus.execute(new GetUsersQuery([body.userId])),
    );
    if (!resultUser || resultUser.length == 0) {
      throw customThrowError({
        description: 'User not found',
        code: 'USER_NOT_FOUND',
        title: 'User not found',
      });
    }
    const tasks = await this.taskRepository.find({
      where: { assignedTo: body.userId },
    });
    return {
      user: resultUser[0],
      tasks: tasks,
    };
  }
}
