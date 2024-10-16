import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';

console.error(join(__dirname, '../../dist', 'static'));

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../dist', 'static')
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
