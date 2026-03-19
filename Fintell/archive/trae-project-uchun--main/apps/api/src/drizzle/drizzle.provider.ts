import { Provider } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';

export const DrizzleProvider: Provider = {
  provide: 'drizzle',
  useFactory: (drizzleService: DrizzleService) => drizzleService.getDrizzle(),
  inject: [DrizzleService],
};
