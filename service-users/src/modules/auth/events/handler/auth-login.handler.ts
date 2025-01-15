import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthEvent } from 'src/model/shema/auth-event.schema';
import { AuthLoginEvent } from 'src/modules/auth/events/auth-login.event';

@EventsHandler(AuthLoginEvent)
export class AuthLoginHandler implements IEventHandler<AuthLoginEvent> {
  constructor(
    @InjectModel(AuthEvent.name)
    private readonly authEventModel: Model<AuthEvent>,
  ) {}

  async handle(event: AuthLoginEvent): Promise<void> {
    await this.authEventModel.create({
      type: 'AuthLogin',
      payload: {
        ...event,
      },
    });
  }
}
