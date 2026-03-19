import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const args = process.argv.slice(2);
  const portArgIndex = args.indexOf('--port');
  let port = 3000;
  if (portArgIndex > -1 && args[portArgIndex + 1]) {
    port = parseInt(args[portArgIndex + 1], 10);
  }

  const hostArgIndex = args.indexOf('--host');
  let host = '0.0.0.0';
  if (hostArgIndex > -1 && args[hostArgIndex + 1]) {
    host = args[hostArgIndex + 1];
  }

  await app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}
bootstrap();
