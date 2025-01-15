import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskEvent } from 'src/model/schema/tasks-event.schema';
import { TaskCreatedEvent } from 'src/tasks/events/task-created.event';

@EventsHandler(TaskCreatedEvent)
export class TaskCreatedHandler implements IEventHandler<TaskCreatedEvent> {
  constructor(
    @InjectModel(TaskEvent.name)
    private readonly taskEventModel: Model<TaskEvent>,
  ) {}

  async handle(event: TaskCreatedEvent): Promise<void> {
    await this.taskEventModel.create({
      type: 'TaskCreated',
      payload: {
        ...event,
      },
    });
  }
}
