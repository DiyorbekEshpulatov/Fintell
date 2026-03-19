import { Module } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';
import { DrizzleProvider } from './drizzle.provider';

@Module({
  providers: [DrizzleService, DrizzleProvider],
  exports: [DrizzleService, DrizzleProvider],
})
export class DrizzleModule {}
