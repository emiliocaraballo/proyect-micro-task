import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthEvent } from 'src/model/shema/auth-event.schema';
import { AuthRefreshEvent } from 'src/modules/auth/events/auth-refresh.event';

@EventsHandler(AuthRefreshEvent)
export class AuthRefreshHandler implements IEventHandler<AuthRefreshEvent> {
  constructor(
    @InjectModel(AuthEvent.name)
    private readonly authEventModel: Model<AuthEvent>,
  ) {}

  async handle(event: AuthRefreshEvent): Promise<void> {
    await this.authEventModel.create({
      type: 'AuthRefresh',
      payload: {
        ...event,
      },
    });
  }
}
