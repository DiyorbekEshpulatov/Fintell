import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { users } from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleService } from './drizzle/drizzle.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly drizzleService: DrizzleService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('users')
  async createUser(@Body() user: {
    fullName: string,
    phone: string
  }) {
    const drizzle = this.drizzleService.getDrizzle();
    const newUser = await drizzle.insert(users).values(user).returning();
    return newUser;
  }
}
