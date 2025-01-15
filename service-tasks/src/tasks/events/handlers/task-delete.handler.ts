import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskEvent } from 'src/model/schema/tasks-event.schema';
import { TaskDeleteEvent } from 'src/tasks/events/task-delete.event';

@EventsHandler(TaskDeleteEvent)
export class TaskDeleteHandler implements IEventHandler<TaskDeleteEvent> {
  constructor(
    @InjectModel(TaskEvent.name)
    private readonly taskEventModel: Model<TaskEvent>,
  ) {}

  async handle(event: TaskDeleteEvent): Promise<void> {
    await this.taskEventModel.create({
      type: 'TaskDelete',
      payload: {
        ...event,
      },
    });
  }
}
