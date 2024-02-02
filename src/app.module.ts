import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import envConfig from "./config/env.config";
import { AppController } from "./features/app/app.controller";
import { AppService } from "./features/app/app.service";
import {
  AuthModule,
  JwtAsyncModule,
  AuthService,
  JwtRefreshService,
} from "./features/auth";
import { MailingModule } from "./features/mailing/mailing.module";
import { ProgramsModule } from "./features/programs/programs.module";
import { UsersModule } from "./features/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      autoLoadEntities: true,
      synchronize: false,
      migrationsRun: true,
      migrations: [__dirname + "/migrations/*.{ts,js}"],
      ...envConfig().database,
    }),
    ProgramsModule,
    UsersModule,
    AuthModule,
    JwtAsyncModule,
    MailingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    JwtRefreshService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
