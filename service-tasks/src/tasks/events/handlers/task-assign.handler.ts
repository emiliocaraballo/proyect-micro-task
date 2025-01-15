import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskEvent } from 'src/model/schema/tasks-event.schema';
import { TaskAssignEvent } from '../task-assign.event';

@EventsHandler(TaskAssignEvent)
export class TaskAssignHandler implements IEventHandler<TaskAssignEvent> {
  constructor(
    @InjectModel(TaskEvent.name)
    private readonly taskEventModel: Model<TaskEvent>,
  ) {}

  async handle(event: TaskAssignEvent): Promise<void> {
    await this.taskEventModel.create({
      type: 'TaskAssign',
      payload: {
        ...event,
      },
    });
  }
}
