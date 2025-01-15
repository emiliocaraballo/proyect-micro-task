import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskEntity } from 'src/model/task/task.entity';
import { customThrowError } from 'service-commons/dist';
import { AssignTaskCommand } from '../assign-task.command';
import { TaskAssignEvent } from 'src/tasks/events/task-assign.event';

@CommandHandler(AssignTaskCommand)
export class AssignTaskHandler implements ICommandHandler<AssignTaskCommand> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(body: AssignTaskCommand) {
    const task = await this.taskRepository.findOne({ where: { id: body.id } });
    if (!task) {
      throw customThrowError({
        description: 'Task not found',
        code: 'TASK_NOT_FOUND',
        title: 'Task not found',
      });
    }
    const updatedTask = this.taskRepository.merge(task, {
      assignedTo: body.userId || null,
      teamId: body.teamId || null,
      updatedAt: new Date(),
      updatedBy: body.userTokenId,
    });
    console.log(updatedTask, 'updatedTask');
    await this.taskRepository.save(updatedTask);

    this.eventBus.publish(
      new TaskAssignEvent(
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
