import { Repository } from 'typeorm';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/model/task/task.entity';
import { GetTeamsTaskQuery } from 'src/tasks/queries/get-teams-task.query';
import { GetTeamsQuery } from 'src/tasks/queries/get-teams.query';
import to from 'await-to-js';
import { GetTeamsTasksDto } from 'src/tasks/tasks.dto';

@QueryHandler(GetTeamsTaskQuery)
export class GetAllTeamHandler implements IQueryHandler<GetTeamsTaskQuery> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(body: GetTeamsTaskQuery): Promise<GetTeamsTasksDto> {
    const [, response] = await to(
      this.queryBus.execute(new GetTeamsQuery([body.teamId])),
    );
    const tasks = await this.taskRepository.find({
      where: { teamId: body.teamId },
    });
    return {
      team: response[0],
      tasks: tasks,
    };
  }
}
