import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { connection } from 'src/model';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  imports: [
    forwardRef(() => TeamsModule),
    connection,
    MongooseModule.forRoot(process.env.DATABASE_MONGO_URI),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
