import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEvent } from 'src/model/shema/user-event.schema';
import { UserCreatedEvent } from 'src/modules/users/events/user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  constructor(
    @InjectModel(UserEvent.name)
    private readonly userEventModel: Model<UserEvent>,
  ) {}

  async handle(event: UserCreatedEvent): Promise<void> {
    await this.userEventModel.create({
      type: 'UserCreated',
      payload: {
        ...event,
      },
    });
  }
}
