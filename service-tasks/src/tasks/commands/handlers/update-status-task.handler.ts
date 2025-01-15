import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskEntity } from 'src/model/task/task.entity';
import { customThrowError } from 'service-commons/dist';
import { UpdateStatusTaskCommand } from '../update-status-task.command';
import { TaskStatusUpdatedEvent } from 'src/tasks/events/task-status-updated.event';

@CommandHandler(UpdateStatusTaskCommand)
export class UpdateStatusTaskHandler
  implements ICommandHandler<UpdateStatusTaskCommand>
{
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(body: UpdateStatusTaskCommand) {
    const task = await this.taskRepository.findOne({ where: { id: body.id } });
    if (!task) {
      throw customThrowError({
        description: 'Task not found',
        code: 'TASK_NOT_FOUND',
        title: 'Task not found',
      });
    }

    const updatedTask = this.taskRepository.merge(task, {
      status: body.status,
      updatedAt: new Date(),
      updatedBy: body.userTokenId,
    });
    await this.taskRepository.save(updatedTask);

    this.eventBus.publish(
      new TaskStatusUpdatedEvent(
        updatedTask.id,
        updatedTask.title,
        updatedTask.description,
        updatedTask.status,
        updatedTask.deadline,
        body.userTokenId,
      ),
    );

    return task;
  }
}
