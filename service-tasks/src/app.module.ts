import { forwardRef, Module } from '@nestjs/common';
import { TasksModule } from 'src/tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { connection } from 'src/model';

@Module({
  imports: [
    connection,
    MongooseModule.forRoot(process.env.DATABASE_MONGO_URI),
    forwardRef(() => TasksModule),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
