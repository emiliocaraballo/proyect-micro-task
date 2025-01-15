import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamEvent } from 'src/model/schema/team-event.schema';
import { TeamUpdatedEvent } from 'src/teams/events/team-updated-event';

@EventsHandler()
export class TeamUpdatedHandler implements IEventHandler<TeamUpdatedEvent> {
  constructor(
    @InjectModel(TeamEvent.name)
    private readonly teamEventModel: Model<TeamEvent>,
  ) {}

  async handle(event: TeamUpdatedEvent): Promise<void> {
    await this.teamEventModel.create({
      type: 'TeamUpdated',
      payload: {
        ...event,
      },
    });
  }
}
