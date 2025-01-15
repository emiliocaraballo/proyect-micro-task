import {
  Controller,
  Post,
  Body,
  Request,
  HttpCode,
  UsePipes,
  HttpStatus,
  BadRequestException,
  Param,
  Put,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from 'src/modules/users/commands/create-user.command';
import {
  RegisterResponseDto,
  UserRegisterDto,
  UserUpdateDto,
} from 'src/modules/users/user.dto';
import {
  IRequest,
  JoiValidationPipe,
  ManyRolesAuth,
  PublicAuth,
  Role,
} from 'service-commons/dist';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  userRegisterSchema,
  userUpdateSchema,
} from 'src/modules/users/joiSchema';
import to from 'await-to-js';
import { UpdateUserCommand } from 'src/modules/users/commands/update-user.command';
import { GetMeUserQuery } from 'src/modules/users/queries/get-me-user.query';
import { EventPattern } from '@nestjs/microservices';
import { GetUsersQuery } from 'src/modules/users/queries/get-users.query';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new JoiValidationPipe(userRegisterSchema))
  @PublicAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: RegisterResponseDto,
  })
  async createUser(@Body() body: UserRegisterDto, @Request() req: IRequest) {
    const { name, lastName, email, password, rol } = body;
    const [error, response] = await to(
      this.commandBus.execute(
        new CreateUserCommand(
          name,
          lastName,
          email,
          password,
          rol,
          req?.user?.sub,
        ),
      ),
    );
    if (error) {
      throw new BadRequestException(error);
    }
    return response;
  }

  @Put('update/:id')
  @ManyRolesAuth([Role.admin, Role.member])
  @UsePipes(new JoiValidationPipe(userUpdateSchema))
  @ApiResponse({
    status: HttpStatus.OK,
    type: RegisterResponseDto,
  })
  async update(
    @Body() body: UserUpdateDto,
    @Param('id') id: number,
    @Request() req: IRequest,
  ) {
    const { name, lastName, email, rol } = body;
    const [error, response] = await to(
      this.commandBus.execute(
        new UpdateUserCommand(
          id,
          name,
          lastName,
          email,
          rol,
          req?.user?.sub,
          req?.user?.rol,
        ),
      ),
    );
    if (error) {
      throw new BadRequestException(error);
    }
    return response;
  }

  @Get('me')
  @ManyRolesAuth([Role.admin, Role.viewer, Role.member])
  @ApiResponse({
    status: HttpStatus.OK,
    type: RegisterResponseDto,
  })
  async me(@Request() req: IRequest) {
    const [error, response] = await to(
      this.queryBus.execute(new GetMeUserQuery(req.user.sub)),
    );
    if (error) {
      throw new UnauthorizedException(error);
    }
    return response;
  }

  @EventPattern('getUserInfoIds')
  async getUserInfoIds(body: any) {
    const [error, response] = await to(
      this.queryBus.execute(new GetUsersQuery(body.ids)),
    );
    if (error) {
      throw new UnauthorizedException(error);
    }
    return response;
  }
}
