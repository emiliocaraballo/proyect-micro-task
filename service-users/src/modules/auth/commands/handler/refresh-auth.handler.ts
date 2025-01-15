import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from 'src/model/user/user.entity';
import { customThrowError } from 'service-commons/dist';
import { RefreshAuthCommand } from 'src/modules/auth/commands/refresh-auth.command';
import { TokenVersionEntity } from 'src/model/version/token.version.entity';
import { JwtService } from '@nestjs/jwt';
import { loginResponseDto } from 'src/modules/auth/auth.dto';
import { AuthRefreshEvent } from 'src/modules/auth/events/auth-refresh.event';

@CommandHandler(RefreshAuthCommand)
export class RefreshAuthHandler implements ICommandHandler<RefreshAuthCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TokenVersionEntity)
    private readonly tokenVersionRepository: Repository<TokenVersionEntity>,
    private readonly jwtService: JwtService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(body: RefreshAuthCommand): Promise<loginResponseDto> {
    let version = '';

    const { refreshToken } = body;
    const payload = this.jwtService.verify(refreshToken);
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      select: ['id', 'refreshToken', 'tokenVersion', 'rol'],
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw customThrowError({
        description: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN',
        title: 'Invalid refresh token',
      });
    }

    if (user.tokenVersion && user.tokenVersion !== payload.version) {
      throw customThrowError({
        description: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN',
        title: 'Invalid refresh token',
      });
    } else if (!user.tokenVersion) {
      const findVersion = await this.tokenVersionRepository.find({
        select: ['version'],
        order: { createdAt: 'DESC', id: 'DESC' },
        take: 1,
      });
      if (findVersion?.[0]?.version !== payload.version) {
        throw customThrowError({
          description: 'Invalid refresh token',
          code: 'INVALID_REFRESH_TOKEN',
          title: 'Invalid refresh token',
        });
      }
      version = findVersion?.[0]?.version;
    } else {
      version = user.tokenVersion;
    }

    const newPayload = { sub: user.id, rol: user.rol, version: version };
    const accessToken = this.jwtService.sign(newPayload, {
      expiresIn: '1h',
    });
    const newRefreshToken = this.jwtService.sign(newPayload, {
      expiresIn: '7d',
    });

    // Actualiza el nuevo refresh token en la base de datos
    await this.userRepository.update(user.id, {
      refreshToken: newRefreshToken,
    });

    this.eventBus.publish(
      new AuthRefreshEvent(
        user.id,
        accessToken,
        newRefreshToken,
        user.rol,
        version,
      ),
    );

    return { accessToken, refreshToken: newRefreshToken };
  }
}
