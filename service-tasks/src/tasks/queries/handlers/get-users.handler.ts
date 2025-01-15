import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import to from 'await-to-js';
import { lastValueFrom, timeout } from 'rxjs';
import { customThrowError } from 'service-commons/dist';
import { GetUsersQuery } from 'src/tasks/queries/get-users.query';
import { GetUserInfoDto } from 'src/tasks/tasks.dto';

@QueryHandler(GetUsersQuery)
export class GetUserSHandler implements IQueryHandler<GetUsersQuery> {
  private apiMicroservice: ClientProxy;

  constructor() {
    this.apiMicroservice = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RMQ_URI],
        queue: 'user_queue', // Cola del microservicio users
        queueOptions: { durable: false },
      },
    });
  }

  async execute(query: GetUsersQuery): Promise<any> {
    const { userIds } = query;

    const [error, response] = await to<GetUserInfoDto[]>(
      lastValueFrom(
        this.apiMicroservice
          .send('getUserInfoIds', {
            ids: userIds,
          })
          .pipe(timeout(5000)),
      ),
    );
    if (error || !response || response.length == 0) {
      throw customThrowError({
        description: 'Error getting user info',
        code: 'ERROR_GETTING_USER_INFO',
        title: 'Error getting user info',
      });
    }
    return response;
  }
}
