import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { customThrowError } from 'service-commons/dist';
import { TeamEntity } from 'src/model/teams/team.entity';
import { TeamMemberEntity } from 'src/model/teams/team.member.entity';
import { In, Repository } from 'typeorm';
import { AddMemberDto } from './teams.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    @InjectRepository(TeamMemberEntity)
    private readonly teamMemberRepository: Repository<TeamMemberEntity>,
  ) {}

  async addMember(
    teamId: number,
    addMemberDto: AddMemberDto,
    userId: number,
  ): Promise<TeamMemberEntity> {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw customThrowError({
        description: 'Team not found',
        code: 'TEAM_NOT_FOUND',
        title: 'Team not found',
      });
    }

    const teamMemberFind = await this.teamMemberRepository.findOne({
      where: { teamId, userId },
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
      userId: addMemberDto.userId,
      role: addMemberDto.role,
      updatedBy: userId,
      createdBy: userId,
    });
    return this.teamMemberRepository.save(teamMember);
  }

  async getTeamInfoIds(ids: number[]): Promise<any[]> {
    const teams = await this.teamRepository.find({
      where: { id: In(ids) },
    });

    return teams.map((team) => ({
      id: team.id,
      name: team.name,
    }));
  }
}
