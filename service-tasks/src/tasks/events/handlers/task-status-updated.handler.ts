import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskEvent } from 'src/model/schema/tasks-event.schema';
import { TaskStatusUpdatedEvent } from '../task-status-updated.event';

@EventsHandler(TaskStatusUpdatedEvent)
export class TaskStatusUpdatedHandler
  implements IEventHandler<TaskStatusUpdatedEvent>
{
  constructor(
    @InjectModel(TaskEvent.name)
    private readonly taskEventModel: Model<TaskEvent>,
  ) {}

  async handle(event: TaskStatusUpdatedEvent): Promise<void> {
    await this.taskEventModel.create({
      type: 'TaskStatusUpdated',
      payload: {
        ...event,
      },
    });
  }
}
