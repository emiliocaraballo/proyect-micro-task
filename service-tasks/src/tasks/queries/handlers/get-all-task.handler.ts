import { Repository } from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/model/task/task.entity';
import { GetAllTaskQuery } from 'src/tasks/queries/get-all-task.query';

@QueryHandler(GetAllTaskQuery)
export class GetAllTaskHandler implements IQueryHandler<GetAllTaskQuery> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}
  execute(body: GetAllTaskQuery): Promise<TaskEntity[]> {
    console.log(body, 'body');
    return this.taskRepository.find();
  }
}
