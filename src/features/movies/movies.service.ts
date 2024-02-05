import { Injectable } from "@nestjs/common";

import { s3Folders } from "src/constants";

import { AwsService } from "../aws";
import {
  PaginationDto,
  PaginationResponseDto,
  getPaginationData,
} from "../common";
import { User, UsersService } from "../users";

import { MovieRequestDto } from "./dto";
import { MovieDto } from "./dto-creators";
import { MoviesRepository } from "./movies.repository";

@Injectable()
export class MoviesService {
  constructor(
    private moviesRepository: MoviesRepository,
    private usersService: UsersService,
    private awsService: AwsService
  ) {}

  async getMovieInfo(id: string, user: User) {
    const currentUser = await this.usersService.findOne(user.id);

    const currentMovie = await this.moviesRepository.getOwnById(
      id,
      currentUser.id
    );

    return new MovieDto(currentMovie);
  }

  async getMovies({ page, perPage }: PaginationDto, user: User) {
    const currentUser = await this.usersService.findOne(user.id);

    const total = await this.moviesRepository.count({
      where: { user: { id: currentUser.id } },
      relations: ["user"],
    });

    const { offset } = getPaginationData(page, perPage, total);

    const paginatedMovies =
      await this.moviesRepository.findMoviesWithPaginationByUserId(
        currentUser.id,
        perPage,
        offset
      );

    return new PaginationResponseDto<MovieDto>(
      paginatedMovies.map((movie) => new MovieDto(movie)),
      page,
      perPage,
      total
    );
  }

  async createMovie(
    createMovieDto: MovieRequestDto,
    user: User,
    image?: Express.Multer.File
  ) {
    const currentUser = await this.usersService.findOne(user.id);

    const createdMovie = await this.moviesRepository.create({
      user: currentUser,
      posterImageUri: null,
      ...createMovieDto,
    });
    await this.moviesRepository.save(createdMovie);

    if (!!image) {
      const uploadedPosterImageUri = await this.awsService.uploadImage(
        image,
        s3Folders.movieImageFolder(createdMovie.id)
      );

      createdMovie.posterImageUri = uploadedPosterImageUri;
      createdMovie.save();
    }

    return new MovieDto(createdMovie);
  }

  async updateMovie(
    id: string,
    user: User,
    updateMovieDto: MovieRequestDto,
    image?: Express.Multer.File
  ) {
    const currentUser = await this.usersService.findOne(user.id);

    const currentMovie = await this.moviesRepository.getOwnById(
      id,
      currentUser.id
    );

    let tempMoviePosterImageUri: string | null = null;

    if (!!image) {
      if (!!currentMovie.posterImageUri) {
        await this.awsService.removeFileByUri(currentMovie.posterImageUri);
      }

      const uploadedPosterImageUri = await this.awsService.uploadImage(
        image,
        s3Folders.movieImageFolder(currentMovie.id)
      );

      tempMoviePosterImageUri = uploadedPosterImageUri;
    }

    await this.moviesRepository.update(currentMovie.id, {
      ...updateMovieDto,
      ...(!!tempMoviePosterImageUri
        ? {
            posterImageUri: tempMoviePosterImageUri,
          }
        : {}),
    });

    const updatedMovie = await this.moviesRepository.getById(currentMovie.id);

    return new MovieDto(updatedMovie);
  }

  async deleteMovie(id: string, user: User) {
    const currentUser = await this.usersService.findOne(user.id);

    const currentMovie = await this.moviesRepository.getOwnById(
      id,
      currentUser.id
    );

    if (!!currentMovie.posterImageUri) {
      await this.awsService.removeFileByUri(currentMovie.posterImageUri);
    }

    await this.moviesRepository.delete(currentMovie.id);
  }
}
