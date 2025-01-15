import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JoiValidationPipe } from 'service-commons/dist';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import to from 'await-to-js';
import { LoginAuthCommand } from 'src/modules/auth/commands/login-auth.command';
import {
  loginPayloadDto,
  loginResponseDto,
  refreshTokenPayloadDto,
} from './auth.dto';
import { loginUserSchema } from './joiSchema';
import { RefreshAuthCommand } from './commands/refresh-auth.command';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Post('/')
  @UsePipes(new JoiValidationPipe(loginUserSchema))
  @ApiResponse({
    status: HttpStatus.OK,
    type: loginResponseDto,
  })
  async login(@Body() body: loginPayloadDto): Promise<loginResponseDto> {
    const { username, password, rol } = body;
    const [error, response] = await to(
      this.commandBus.execute(new LoginAuthCommand(username, password, rol)),
    );
    if (error) {
      throw new BadRequestException(error);
    }
    return response;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: refreshTokenPayloadDto) {
    const { refreshToken } = body;
    const [error, response] = await to(
      this.commandBus.execute(new RefreshAuthCommand(refreshToken)),
    );
    if (error) {
      throw new UnauthorizedException(error);
    }
    return response;
  }
}
