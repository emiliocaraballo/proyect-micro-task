import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TeamEntity } from 'src/model/teams/team.entity';
import { TeamMemberEntity } from 'src/model/teams/team.member.entity';
import { customThrowError } from 'service-commons/dist';
import { AddMemberTeamCommand } from 'src/teams/commands/add-member-team.command';
import { TeamAddMemberEvent } from 'src/teams/events/team-add-member-event';

@CommandHandler(AddMemberTeamCommand)
export class AddMemberTeamHandler
  implements ICommandHandler<AddMemberTeamCommand>
{
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    @InjectRepository(TeamMemberEntity)
    private readonly teamMemberRepository: Repository<TeamMemberEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(body: AddMemberTeamCommand): Promise<TeamMemberEntity> {
    const team = await this.teamRepository.findOne({ where: { id: body.id } });
    if (!team) {
      throw customThrowError({
        description: 'Team not found',
        code: 'TEAM_NOT_FOUND',
        title: 'Team not found',
      });
    }

    const teamMemberFind = await this.teamMemberRepository.findOne({
      where: { teamId: body.id, userId: body.userId },
    });
    if (teamMemberFind) {
      throw customThrowError({
        description: 'User already in team',
        code: 'USER_ALREADY_IN_TEAM',
        title: 'User already in team',
      });
    }

    const teamMember = this.teamMemberRepository.create({
      team,
      userId: body.userId,
      role: body.role,
      updatedBy: body.userTokenData.sub,
      createdBy: body.userTokenData.sub,
    });
    const savedTeamMember = await this.teamMemberRepository.save(teamMember);

    this.eventBus.publish(
      new TeamAddMemberEvent(
        savedTeamMember.id,
        team.name,
        body.userId,
        body.role,
      ),
    );

    return savedTeamMember;
  }
}
