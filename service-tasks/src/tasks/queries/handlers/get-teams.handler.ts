import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import to from 'await-to-js';
import { lastValueFrom, timeout } from 'rxjs';
import { customThrowError } from 'service-commons/dist';
import { GetUserInfoDto } from 'src/tasks/tasks.dto';
import { GetTeamsQuery } from 'src/tasks/queries/get-teams.query';

@QueryHandler(GetTeamsQuery)
export class GetTeamsSHandler implements IQueryHandler<GetTeamsQuery> {
  private apiMicroservice: ClientProxy;

  constructor() {
    this.apiMicroservice = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RMQ_URI],
        queue: 'team_queue', // Cola del microservicio Teams
        queueOptions: { durable: false },
      },
    });
  }

  async execute(query: GetTeamsQuery): Promise<any> {
    const { teamIds } = query;

    const [error, response] = await to<GetUserInfoDto[]>(
      lastValueFrom(
        this.apiMicroservice
          .send('getTeamInfoIds', {
            ids: teamIds,
          })
          .pipe(timeout(5000)),
      ),
    );
    if (error || !response || response.length == 0) {
      throw customThrowError({
        description: 'Error getting trams info',
        code: 'ERROR_GETTING_TEAM_INFO',
        title: 'Error getting team info',
      });
    }
    return response;
  }
}
