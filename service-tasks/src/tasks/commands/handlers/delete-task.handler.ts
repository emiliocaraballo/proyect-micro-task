import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskEntity } from 'src/model/task/task.entity';
import { customThrowError } from 'service-commons/dist';
import { DeleteTaskCommand } from 'src/tasks/commands/delete-task.command';
import { TaskDeleteEvent } from 'src/tasks/events/task-delete.event';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(body: DeleteTaskCommand) {
    const task = await this.taskRepository.findOne({ where: { id: body.id } });
    if (!task) {
      throw customThrowError({
        description: 'Task not found',
        code: 'TASK_NOT_FOUND',
        title: 'Task not found',
      });
    }

    await this.taskRepository.remove(task);

    this.eventBus.publish(
      new TaskDeleteEvent(
        task.id,
        task.title,
        task.description,
        task.status,
        task.deadline,
        body.userTokenId,
      ),
    );

    return task;
  }
}
