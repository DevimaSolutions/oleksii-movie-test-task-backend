import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AwsModule } from "../aws";
import { UsersModule } from "../users";

import { Movie } from "./entities";
import { MoviesController } from "./movies.controller";
import { MoviesRepository } from "./movies.repository";
import { MoviesService } from "./movies.service";

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), UsersModule, AwsModule],
  controllers: [MoviesController],
  providers: [MoviesService, MoviesRepository],
  exports: [MoviesService],
})
export class MoviesModule {}
