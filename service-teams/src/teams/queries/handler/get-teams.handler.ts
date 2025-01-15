import { TeamEntity } from 'src/model/teams/team.entity';
import { In, Repository } from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GetTeamsQuery } from '../get-teams.query';

@QueryHandler(GetTeamsQuery)
export class GetTeamsHandler implements IQueryHandler<GetTeamsQuery> {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
  ) {}
  execute(body: GetTeamsQuery): Promise<TeamEntity[]> {
    const result = this.teamRepository.find({
      where: {
        id: In(body.teamIds),
      },
    });
    return result;
  }
}
