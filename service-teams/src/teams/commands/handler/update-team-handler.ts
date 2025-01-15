import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TeamEntity } from 'src/model/teams/team.entity';
import { UpdateTeamCommand } from 'src/teams/commands/update-team-command';
import { customThrowError } from 'service-commons/dist';
import { TeamUpdatedEvent } from 'src/teams/events/team-updated-event';

@CommandHandler(UpdateTeamCommand)
export class UpdateTeamHandler implements ICommandHandler<UpdateTeamCommand> {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(body: UpdateTeamCommand) {
    const team = await this.teamRepository.findOne({ where: { id: body.id } });
    if (!team) {
      throw customThrowError({
        description: 'Team not found',
        code: 'TEAM_NOT_FOUND',
        title: 'Team not found',
      });
    }
    const updatedTeam = this.teamRepository.merge(team, {
      name: body.name,
      updatedBy: body.userId,
      updatedAt: new Date(),
    });
    const savedTeam = await this.teamRepository.save(updatedTeam);
    this.eventBus.publish(
      new TeamUpdatedEvent(savedTeam.id, savedTeam.name, body.userId),
    );

    return savedTeam;
  }
}
