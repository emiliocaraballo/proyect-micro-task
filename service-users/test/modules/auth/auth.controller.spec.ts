import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { LoginAuthCommand } from 'src/modules/auth/commands/login-auth.command';
import { AuthController } from 'src/modules/auth/auth.controller';
import { loginPayloadDto, loginResponseDto } from 'src/modules/auth/auth.dto';
import { Role } from 'service-commons/dist';
import { RefreshAuthCommand } from 'src/modules/auth/commands/refresh-auth.command';

describe('AuthController', () => {
  let authController: AuthController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  describe('login', () => {
    it('debe devolver una respuesta válida cuando las credenciales son correctas', async () => {
      const mockResponse: loginResponseDto = {
        accessToken: 'mockAccessToken123',
        refreshToken: 'mockRefreshToken456',
      };
      jest.spyOn(commandBus, 'execute').mockResolvedValue(mockResponse);

      const payload: loginPayloadDto = {
        username: 'testUser',
        password: 'testPassword',
        rol: Role.admin,
      };

      const result = await authController.login(payload);

      expect(result).toEqual(mockResponse);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new LoginAuthCommand('testUser', 'testPassword', Role.admin),
      );
    });

    it('debe lanzar una BadRequestException si ocurre un error', async () => {
      const mockError = new Error('Credenciales inválidas');
      jest.spyOn(commandBus, 'execute').mockRejectedValue(mockError);

      await expect(
        authController.login({
          username: 'testUser',
          password: 'wrongPassword',
          rol: Role.admin,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('refresh', () => {
    it('debe devolver una nueva respuesta de token cuando el refreshToken es válido', async () => {
      const mockResponse = { token: 'newTestToken' };
      jest.spyOn(commandBus, 'execute').mockResolvedValue(mockResponse);

      const result = await authController.refresh({
        refreshToken: 'validRefreshToken',
      });

      expect(result).toEqual(mockResponse);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new RefreshAuthCommand('validRefreshToken'),
      );
    });

    it('debe lanzar una UnauthorizedException si el refreshToken es inválido', async () => {
      const mockError = new Error('Refresh token inválido');
      jest.spyOn(commandBus, 'execute').mockRejectedValue(mockError);

      await expect(
        authController.refresh({ refreshToken: 'invalidRefreshToken' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
