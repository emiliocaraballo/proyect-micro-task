import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamEvent } from 'src/model/schema/team-event.schema';
import { TeamCreatedEvent } from 'src/teams/events/team-created-event';

@EventsHandler(TeamCreatedEvent)
export class TeamCreatedHandler implements IEventHandler<TeamCreatedEvent> {
  constructor(
    @InjectModel(TeamEvent.name)
    private readonly teamEventModel: Model<TeamEvent>,
  ) {}

  async handle(event: TeamCreatedEvent): Promise<void> {
    await this.teamEventModel.create({
      type: 'TeamCreated',
      payload: {
        ...event,
      },
    });
  }
}
