import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from 'src/model/user/user.entity';
import { UserCreatedEvent } from 'src/modules/users/events/user-created.event';
import { UpdateUserCommand } from 'src/modules/users/commands/update-user.command';
import { customThrowError } from 'service-commons/dist';
import { RegisterResponseDto } from 'src/modules/users/user.dto';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(body: UpdateUserCommand): Promise<RegisterResponseDto> {
    const user = await this.userRepository.findOne({
      where: {
        id: body.id,
      },
    });

    if (!user) {
      throw customThrowError({
        description: 'User not found',
        code: 'USER_NOT_FOUND',
        title: 'User not found',
      });
    }
    const userRole = body.userRol;
    const payload = {
      name: body?.name || null,
      lastName: body?.lastName || null,
      rol: userRole == 'admin' ? body?.rol || null : null, // solo admin puede cambiar rol
      updatedBy: body.userId,
      updatedAt: new Date(),
    };
    const mergedUser = this.userRepository.merge(user, payload);
    const updatedUser = await this.userRepository.save(mergedUser);

    this.eventBus.publish(
      new UserCreatedEvent(
        updatedUser.id,
        updatedUser.name,
        updatedUser.lastName,
        updatedUser.email,
        updatedUser.rol,
      ),
    );
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      rol: updatedUser.rol,
    };
  }

  private isValidHexadecimal(value: string): boolean {
    const hexRegex = /^[0-9A-Fa-f]{64}$/;
    return hexRegex.test(value);
  }
}
