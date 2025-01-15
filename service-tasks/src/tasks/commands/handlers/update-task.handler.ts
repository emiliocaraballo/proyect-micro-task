import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskEntity } from 'src/model/task/task.entity';
import { UpdatedTaskCommand } from 'src/tasks/commands/update-task-command';
import { customThrowError } from 'service-commons/dist';
import { TaskUpdatedEvent } from 'src/tasks/events/task-updated.event';

@CommandHandler(UpdatedTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdatedTaskCommand> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(body: UpdatedTaskCommand) {
    const task = await this.taskRepository.findOne({ where: { id: body.id } });
    if (!task) {
      throw customThrowError({
        description: 'Task not found',
        code: 'TASK_NOT_FOUND',
        title: 'Task not found',
      });
    }

    const updatedTask = this.taskRepository.merge(task, {
      updatedAt: new Date(),
      updatedBy: body.userTokenId,
      status: body?.status,
      deadline: body?.deadline,
      title: body?.title,
      description: body?.description,
    });

    await this.taskRepository.save(updatedTask);

    this.eventBus.publish(
      new TaskUpdatedEvent(
        updatedTask.id,
        updatedTask.title,
        updatedTask.description,
        updatedTask.status,
        updatedTask.deadline,
        body.userTokenId,
      ),
    );

    return updatedTask;
  }
}
