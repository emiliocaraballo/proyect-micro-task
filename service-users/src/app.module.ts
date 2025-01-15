import { forwardRef, Module } from '@nestjs/common';
import { connection } from 'src/model';
import { UserModule } from 'src/modules/users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    connection,
    MongooseModule.forRoot(process.env.DATABASE_MONGO_URI),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
