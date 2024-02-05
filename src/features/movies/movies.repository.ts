import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";

import { ElementaryRepository } from "../common";

import { Movie } from "./entities";

@Injectable()
export class MoviesRepository extends ElementaryRepository<Movie> {
  constructor(private dataSource: DataSource) {
    super(Movie, dataSource.createEntityManager());
  }

  async getById(id: string) {
    const movie = await this.findOne({ where: { id }, relations: ["user"] });
    if (!movie) {
      throw new NotFoundException();
    }

    return movie;
  }

  async getOwnById(id: string, userId: string) {
    const movie = await this.findOne({
      where: { id, user: { id: userId } },
      relations: ["user"],
    });
    if (!movie) {
      throw new NotFoundException();
    }

    return movie;
  }

  async findMoviesWithPaginationByUserId(
    userId: string,
    limit: number,
    offset: number
  ) {
    const movies = await this.find({
      where: { user: { id: userId } },
      relations: ["user"],
      take: limit,
      skip: offset,
      order: { createdAt: "DESC" },
    });

    return movies;
  }
}
