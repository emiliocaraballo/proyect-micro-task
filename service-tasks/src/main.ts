import { NestFactory } from '@nestjs/core';
import { json } from 'body-parser';
import helmet from 'helmet';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

import { setSwaggerConfig } from 'service-commons/dist/swagger.config';
import { HttpExceptionFilter } from 'service-commons/dist';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // Set limit to request
  app.use(json({ limit: '1mb' }));

  // Set prefix
  app.setGlobalPrefix(process.env.API_PREFIX);

  // Set security
  if (process.env.NODE_ENV === 'production') {
    app.use(
      helmet({
        contentSecurityPolicy: false,
      }),
    );
  } else {
    app.use(helmet());
  }

  if (process.env.NODE_ENV !== 'production') {
    // Set swagger docs
    setSwaggerConfig(app, process.env.API_PREFIX + '/docs');
  }

  // Set general error filter
  app.useGlobalFilters(new HttpExceptionFilter('api-tasks'));
  // Microservice configuration (Hybrid application)
  // app.connectMicroservice({
  //   transport: Transport.REDIS,
  //   options: {
  //     host: process.env.REDIS_HOST || 'localhost', // Asegúrate de que las variables estén configuradas
  //     port: Number(process.env.REDIS_PORT) || 6379,
  //   },
  // });
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URI],
      queue: 'task_queue',
      queueOptions: { durable: false },
    },
  });
  // Init app services
  try {
    await app.startAllMicroservices();
    console.log('Microservicios iniciados');
  } catch (error) {
    console.error('Error al iniciar microservicios:', error);
  }
  await app.listen(process.env.API_PORT);
}
bootstrap();
/*
  private async getTeamInfoIds(ids: number[]): Promise<GetTeamInfoDto> {
    const [error, response] = await to<GetTeamInfoDto[]>(
      lastValueFrom(
        this.apiMicroservice
          .send('getTeamInfoIds', {
            ids: ids,
          })
          .pipe(timeout(5000)),
      ),
    );
    if (error || !response || response.length == 0) {
      throw customThrowError({
        description: 'Error getting team info',
        code: 'ERROR_GETTING_TEAM_INFO',
        title: 'Error getting team info',
      });
    }
    return response[0];
  }
*/
