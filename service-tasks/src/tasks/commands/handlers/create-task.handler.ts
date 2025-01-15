import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskEntity } from 'src/model/task/task.entity';
import { TaskStatus } from 'src/model/task/task.enum';
import { CreatedTaskCommand } from 'src/tasks/commands/create-task.command';
import { TaskCreatedEvent } from 'src/tasks/events/task-created.event';

@CommandHandler(CreatedTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreatedTaskCommand> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(body: CreatedTaskCommand) {
    const task = this.taskRepository.create({
      title: body.title,
      description: body.description,
      status: body?.status || TaskStatus.TO_DO,
      deadline: body?.deadline || null,
      createdBy: body.userTokenId,
      updatedBy: body.userTokenId,
    });

    const savedTask = await this.taskRepository.save(task);

    this.eventBus.publish(
      new TaskCreatedEvent(
        savedTask.id,
        savedTask.title,
        savedTask.description,
        savedTask.status,
        savedTask.deadline,
        body.userTokenId,
      ),
    );

    return savedTask;
  }
}
