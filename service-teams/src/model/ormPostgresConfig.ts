// Commons
import { ormPostgresConfig } from 'service-commons/dist/model/ormPostgresConfig';

// Libraries
import { join } from 'path';

const config = ormPostgresConfig(
  join(__dirname, '**', '*.entity.{ts,js}'),
  __dirname + '/migrations/*.ts',
);

export = config;
