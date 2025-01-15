import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateUserCommand } from 'src/modules/users/commands/create-user.command';
import { UpdateUserCommand } from 'src/modules/users/commands/update-user.command';
import { GetMeUserQuery } from 'src/modules/users/queries/get-me-user.query';
import { IRequest, Role } from 'service-commons/dist';
import { UserController } from 'src/modules/users/user.controller';
import {
  RegisterResponseDto,
  UserRegisterDto,
  UserUpdateDto,
} from 'src/modules/users/user.dto';
import { JwtModule } from '@nestjs/jwt';

describe('UserController', () => {
  let userController: UserController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [
        JwtModule.register({
          secret: 'test-secret', // Utiliza un valor de prueba
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() }, // Mock CommandBus
        },
        {
          provide: QueryBus,
          useValue: { execute: jest.fn() }, // Mock QueryBus
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  describe('createUser', () => {
    it('debe registrar un usuario exitosamente', async () => {
      const mockResponse: RegisterResponseDto = {
        id: 1,
        name: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
      };
      const payload: UserRegisterDto = {
        name: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        rol: Role.member,
      };

      jest.spyOn(commandBus, 'execute').mockResolvedValue(mockResponse);

      const req: IRequest = {
        user: {
          sub: 1,
          rol: 'admin',
          createdAtToken: '2023-01-01T00:00:00.000Z',
        },
      };

      const result = await userController.createUser(payload, req);

      expect(result).toEqual(mockResponse);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateUserCommand(
          payload.name,
          payload.lastName,
          payload.email,
          payload.password,
          payload.rol,
          req.user.sub,
        ),
      );
    });

    it('debe lanzar una BadRequestException en caso de error', async () => {
      const payload: UserRegisterDto = {
        name: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        rol: Role.member,
      };

      jest
        .spyOn(commandBus, 'execute')
        .mockRejectedValue(new Error('Error al crear el usuario'));

      const req: IRequest = {
        user: {
          sub: 1,
          rol: 'admin',
          createdAtToken: '2023-01-01T00:00:00.000Z',
        },
      };

      await expect(userController.createUser(payload, req)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('debe actualizar un usuario exitosamente', async () => {
      const mockResponse: RegisterResponseDto = {
        id: 1,
        name: 'John Updated',
        lastName: 'Doe Updated',
        email: 'updated@example.com',
      };
      const payload: UserUpdateDto = {
        name: 'John Updated',
        lastName: 'Doe Updated',
        email: 'updated@example.com',
        rol: Role.admin,
      };

      jest.spyOn(commandBus, 'execute').mockResolvedValue(mockResponse);

      const req: IRequest = {
        user: {
          sub: 1,
          rol: 'admin',
          createdAtToken: '2023-01-01T00:00:00.000Z',
        },
      };

      const result = await userController.update(payload, 1, req);

      expect(result).toEqual(mockResponse);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateUserCommand(
          1,
          payload.name,
          payload.lastName,
          payload.email,
          payload.rol,
          req.user.sub,
          req.user.rol,
        ),
      );
    });

    it('debe lanzar una BadRequestException en caso de error', async () => {
      const payload: UserUpdateDto = {
        name: 'John Updated',
        lastName: 'Doe Updated',
        email: 'updated@example.com',
        rol: Role.admin,
      };

      jest
        .spyOn(commandBus, 'execute')
        .mockRejectedValue(new Error('Error al actualizar el usuario'));

      const req: IRequest = {
        user: {
          sub: 1,
          rol: 'admin',
          createdAtToken: '2023-01-01T00:00:00.000Z',
        },
      };

      await expect(userController.update(payload, 1, req)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('me', () => {
    it('debe devolver los datos del usuario autenticado', async () => {
      const mockResponse: RegisterResponseDto = {
        id: 1,
        name: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
      };

      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockResponse);

      const req: IRequest = {
        user: {
          sub: 1,
          rol: 'admin',
          createdAtToken: '2023-01-01T00:00:00.000Z',
        },
      };

      const result = await userController.me(req);

      expect(result).toEqual(mockResponse);
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetMeUserQuery(req.user.sub),
      );
    });

    it('debe lanzar una UnauthorizedException en caso de error', async () => {
      jest
        .spyOn(queryBus, 'execute')
        .mockRejectedValue(new Error('Usuario no autorizado'));

      const req: IRequest = {
        user: {
          sub: 1,
          rol: 'admin',
          createdAtToken: '2023-01-01T00:00:00.000Z',
        },
      };

      await expect(userController.me(req)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
