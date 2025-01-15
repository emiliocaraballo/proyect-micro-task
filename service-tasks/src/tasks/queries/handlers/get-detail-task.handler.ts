import { Repository } from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/model/task/task.entity';
import { GetDetailTaskQuery } from 'src/tasks/queries/get-detail-task.query';

@QueryHandler(GetDetailTaskQuery)
export class GetDetailTaskHandler implements IQueryHandler<GetDetailTaskQuery> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}
  execute(body: GetDetailTaskQuery): Promise<TaskEntity> {
    return this.taskRepository.findOne({ where: { id: body.id } });
  }
}
