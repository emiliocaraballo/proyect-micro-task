import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from 'src/model/user/user.entity';
import { UserCreatedEvent } from 'src/modules/users/events/user-created.event';
import { CreateUserCommand } from 'src/modules/users/commands/create-user.command';
import { customThrowError } from 'service-commons/dist';
import { RegisterResponseDto } from 'src/modules/users/user.dto';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(body: CreateUserCommand): Promise<RegisterResponseDto> {
    if (!this.isValidHexadecimal(body.password)) {
      throw customThrowError({
        description: 'User or password is not valid',
        code: 'INVALID_CREDENTIALS',
        title: 'Invalid credentials',
      });
    }

    if (await this.userRepository.findOne({ where: { email: body.email } })) {
      throw customThrowError({
        description: 'User already exists',
        code: 'USER_ALREADY_EXISTS',
        title: 'User already exists',
      });
    }
    const newUser = this.userRepository.create({
      name: body.name,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      rol: body.rol,
      createdBy: body?.userId,
      updatedBy: body?.userId,
    });
    const savedUser = await this.userRepository.save(newUser);

    this.eventBus.publish(
      new UserCreatedEvent(
        savedUser.id,
        savedUser.name,
        savedUser.lastName,
        savedUser.email,
        savedUser.rol,
      ),
    );
    return {
      id: savedUser.id,
      name: savedUser.name,
      lastName: savedUser.lastName,
      email: savedUser.email,
      rol: savedUser.rol,
    };
  }

  private isValidHexadecimal(value: string): boolean {
    const hexRegex = /^[0-9A-Fa-f]{64}$/;
    return hexRegex.test(value);
  }
}
