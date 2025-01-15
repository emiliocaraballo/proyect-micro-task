import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEvent } from 'src/model/shema/user-event.schema';
import { UserUpdatedEvent } from 'src/modules/users/events/user-updated.event';

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedHandler implements IEventHandler<UserUpdatedEvent> {
  constructor(
    @InjectModel(UserEvent.name)
    private readonly userEventModel: Model<UserEvent>,
  ) {}

  async handle(event: UserUpdatedEvent): Promise<void> {
    await this.userEventModel.create({
      type: 'UserUpdated',
      payload: {
        ...event,
      },
    });
  }
}
