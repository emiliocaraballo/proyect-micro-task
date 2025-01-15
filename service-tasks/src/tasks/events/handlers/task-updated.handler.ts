import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskEvent } from 'src/model/schema/tasks-event.schema';
import { TaskUpdatedEvent } from '../task-updated.event';

@EventsHandler(TaskUpdatedEvent)
export class TaskUpdatedHandler implements IEventHandler<TaskUpdatedEvent> {
  constructor(
    @InjectModel(TaskEvent.name)
    private readonly taskEventModel: Model<TaskEvent>,
  ) {}

  async handle(event: TaskUpdatedEvent): Promise<void> {
    await this.taskEventModel.create({
      type: 'TaskUpdated',
      payload: {
        ...event,
      },
    });
  }
}
