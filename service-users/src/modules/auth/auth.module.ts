import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity } from 'src/model/user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthEvent, AuthEventSchema } from 'src/model/shema/auth-event.schema';
import { LoginAuthHandler } from 'src/modules/auth/commands/handler/login-auth.handler';
import { AuthLoginHandler } from 'src/modules/auth/events/handler/auth-login.handler';
import { AuthRefreshHandler } from 'src/modules/auth/events/handler/auth-refresh.handler';
import { TokenVersionEntity } from 'src/model/version/token.version.entity';
import { AuthController } from 'src/modules/auth/auth.controller';
import { RefreshAuthHandler } from 'src/modules/auth/commands/handler/refresh-auth.handler';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.API_TOKEN_KEY_VALUE,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([UserEntity, TokenVersionEntity]),
    MongooseModule.forFeature([
      { name: AuthEvent.name, schema: AuthEventSchema },
    ]),
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [
    LoginAuthHandler,
    AuthLoginHandler,
    RefreshAuthHandler,
    AuthRefreshHandler,
  ],
})
export class AuthModule {}
