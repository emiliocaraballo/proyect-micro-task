import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamEvent } from 'src/model/schema/team-event.schema';
import { TeamAddMemberEvent } from 'src/teams/events/team-add-member-event';

@EventsHandler(TeamAddMemberEvent)
export class TeamAddMemberHandler implements IEventHandler<TeamAddMemberEvent> {
  constructor(
    @InjectModel(TeamEvent.name)
    private readonly teamEventModel: Model<TeamEvent>,
  ) {}

  async handle(event: TeamAddMemberEvent): Promise<void> {
    await this.teamEventModel.create({
      type: 'TeamAddMember',
      payload: {
        ...event,
      },
    });
  }
}
