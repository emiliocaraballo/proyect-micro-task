import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/model/user/user.entity';
import { RegisterResponseDto } from 'src/modules/users/user.dto';
import { customThrowError } from 'service-commons/dist';
import { GetMeUserQuery } from 'src/modules/users/queries/get-me-user.query';

@QueryHandler(GetMeUserQuery)
export class GetMeUserHandler implements IQueryHandler<GetMeUserQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(body: GetMeUserQuery): Promise<RegisterResponseDto> {
    const { id } = body;
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw customThrowError({
        description: 'User not found',
        code: 'USER_NOT_FOUND',
        title: 'User not found',
      });
    }

    return {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      rol: user.rol,
    };
  }
}
