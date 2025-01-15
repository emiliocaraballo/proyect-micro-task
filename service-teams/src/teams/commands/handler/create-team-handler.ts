import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TeamEntity } from 'src/model/teams/team.entity';
import { CreatedTeamCommand } from 'src/teams/commands/create-team-command';
import { TeamCreatedEvent } from 'src/teams/events/team-created-event';

@CommandHandler(CreatedTeamCommand)
export class CreateTeamHandler implements ICommandHandler<CreatedTeamCommand> {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(body: CreatedTeamCommand) {
    const team = this.teamRepository.create({
      name: body.name,
      createdBy: body.userId,
      updatedBy: body.userId,
    });
    const savedTeam = await this.teamRepository.save(team);

    this.eventBus.publish(
      new TeamCreatedEvent(savedTeam.id, savedTeam.name, body.userId),
    );

    return {
      id: savedTeam.id,
      name: savedTeam.name,
    };
  }
}
