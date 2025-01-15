import { TeamEntity } from 'src/model/teams/team.entity';
import { Repository } from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllTeamQuery } from 'src/teams/queries/get-all-team.query';

@QueryHandler(GetAllTeamQuery)
export class GetAllTeamHandler implements IQueryHandler<GetAllTeamQuery> {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
  ) {}
  execute(body: GetAllTeamQuery): Promise<TeamEntity[]> {
    console.log(body, 'body');
    return this.teamRepository.find();
  }
}
