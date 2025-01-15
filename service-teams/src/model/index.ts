// Libraries
import { TypeOrmModule } from '@nestjs/typeorm';

// Config
import * as config from './ormPostgresConfig';

export const connection = TypeOrmModule.forRoot(config);
