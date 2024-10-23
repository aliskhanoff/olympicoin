import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    },
  );
  const port = Number(process.env.SERVER_PORT) || 3000;
  app.enableShutdownHooks();

  await app.listen(port);
}

bootstrap();
