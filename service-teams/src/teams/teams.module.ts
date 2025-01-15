import { Module } from '@nestjs/common';
import { TeamsController } from 'src/teams/teams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from 'src/model/teams/team.entity';
import { TeamMemberEntity } from 'src/model/teams/team.member.entity';
import { JwtModule } from '@nestjs/jwt';
import { TeamCreatedHandler } from 'src/teams/events/handler/team-created.handler';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { TeamEvent, TeamEventSchema } from 'src/model/schema/team-event.schema';
import { CreateTeamHandler } from 'src/teams/commands/handler/create-team-handler';
import { GetAllTeamHandler } from 'src/teams/queries/handler/get-all-team.handler';
import { UpdateTeamHandler } from 'src/teams/commands/handler/update-team-handler';
import { TeamUpdatedHandler } from 'src/teams/events/handler/team-updated.handler';
import { AddMemberTeamHandler } from 'src/teams/commands/handler/add-member-team.handler';
import { TeamAddMemberHandler } from 'src/teams/events/handler/team-add-member.handler';
import { GetTeamsHandler } from './queries/handler/get-teams.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamEntity, TeamMemberEntity]),
    MongooseModule.forFeature([
      { name: TeamEvent.name, schema: TeamEventSchema },
    ]),
    CqrsModule,
    // ClientsModule.register([
    //   {
    //     name: 'API_MICROSERVICE_TRANSFER',
    //     transport: Transport.REDIS,
    //     options: {
    //       host: process.env.REDIS_HOST,
    //       port: Number(process.env.REDIS_PORT),
    //     },
    //   },
    // ]),
    JwtModule.register({
      secret: process.env.API_TOKEN_KEY_VALUE,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [TeamsController],
  providers: [
    CreateTeamHandler,
    TeamCreatedHandler,
    GetAllTeamHandler,
    UpdateTeamHandler,
    TeamUpdatedHandler,
    AddMemberTeamHandler,
    TeamAddMemberHandler,
    GetTeamsHandler,
  ],
})
export class TeamsModule {}
