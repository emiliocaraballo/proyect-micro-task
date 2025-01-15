import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/model/user/user.entity';
import { RegisterResponseDto } from 'src/modules/users/user.dto';
import { customThrowError } from 'service-commons/dist';
import { GetUsersQuery } from 'src/modules/users/queries/get-users.query';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(body: GetUsersQuery): Promise<RegisterResponseDto[]> {
    const { userIds } = body;
    const users = await this.userRepository.find({
      where: { id: In(userIds) },
    });

    if (!users || users.length == 0) {
      throw customThrowError({
        description: 'User not found',
        code: 'USER_NOT_FOUND',
        title: 'User not found',
      });
    }

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      rol: user.rol,
    }));
  }
}
