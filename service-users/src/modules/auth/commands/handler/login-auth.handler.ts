import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from 'src/model/user/user.entity';
import { customThrowError } from 'service-commons/dist';
import { LoginAuthCommand } from '../login-auth.command';
import { loginResponseDto } from '../../auth.dto';
import { TokenVersionEntity } from 'src/model/version/token.version.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginEvent } from '../../events/auth-login.event';

@CommandHandler(LoginAuthCommand)
export class LoginAuthHandler implements ICommandHandler<LoginAuthCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TokenVersionEntity)
    private readonly tokenVersionRepository: Repository<TokenVersionEntity>,
    private readonly eventBus: EventBus,
    private readonly jwtService: JwtService,
  ) {}

  async execute(body: LoginAuthCommand): Promise<loginResponseDto> {
    if (!this.isValidHexadecimal(body.password)) {
      throw customThrowError({
        description: 'User or password is not valid',
        code: 'INVALID_CREDENTIALS',
        title: 'Invalid credentials',
      });
    }

    const user = await this.userRepository.findOne({
      where: { email: body.username, rol: body.rol, password: body.password },
      select: ['id', 'password', 'rol', 'tokenVersion'],
    });

    // usuario no encontrado
    if (!user) {
      throw customThrowError({
        description: 'User not found',
        code: 'USER_NOT_FOUND',
        title: 'User not found',
      });
    }

    if (!user) {
      throw customThrowError({
        description: 'User or password is not valid',
        code: 'INVALID_CREDENTIALS',
        title: 'Invalid credentials',
      });
    }

    let version = '';
    if (user.tokenVersion) {
      version = user.tokenVersion;
    } else {
      const findVersion = await this.tokenVersionRepository.find({
        select: ['version'],
        order: { createdAt: 'DESC', id: 'DESC' },
        take: 1,
      });
      version = findVersion?.[0]?.version;
    }

    const payload = { sub: user.id, rol: user.rol, version: version };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Guarda el refresh token en la base de datos
    await this.userRepository.update(user.id, { refreshToken });

    this.eventBus.publish(
      new AuthLoginEvent(user.id, version, user.rol, accessToken, refreshToken),
    );

    return { accessToken, refreshToken };
  }

  private isValidHexadecimal(value: string): boolean {
    const hexRegex = /^[0-9A-Fa-f]{64}$/;
    return hexRegex.test(value);
  }
}
