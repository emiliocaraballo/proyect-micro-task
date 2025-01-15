import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEvent, UserEventSchema } from 'src/model/shema/user-event.schema';
import { UserController } from 'src/modules/users/user.controller';
import { CreateUserHandler } from 'src/modules/users/commands/handler/create-user.handler';
import { UserEntity } from 'src/model/user/user.entity';
import { UserCreatedHandler } from 'src/modules/users/events/handler/user-created.handler';
import { JwtModule } from '@nestjs/jwt';
import { UpdateUserHandler } from 'src/modules/users/commands/handler/update-user.handler';
import { UserUpdatedHandler } from 'src/modules/users/events/handler/user-updated.handler';
import { GetMeUserHandler } from 'src/modules/users/queries/handler/get-me-user.handler';
import { GetUsersHandler } from 'src/modules/users/queries/handler/get-users.handler';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.API_TOKEN_KEY_VALUE,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([UserEntity]),
    MongooseModule.forFeature([
      { name: UserEvent.name, schema: UserEventSchema },
    ]),
    CqrsModule,
  ],
  controllers: [UserController],
  providers: [
    CreateUserHandler,
    UserCreatedHandler,
    UpdateUserHandler,
    UserUpdatedHandler,
    GetMeUserHandler,
    GetUsersHandler,
  ],
})
export class UserModule {}
