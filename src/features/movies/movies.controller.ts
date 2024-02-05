import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Req,
  Body,
  Query,
  Param,
  ParseFilePipe,
  HttpStatus,
  FileTypeValidator,
  UploadedFile,
  MaxFileSizeValidator,
  HttpCode,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";

import { fileConstants } from "src/constants";

import { JoiValidationPipe } from "../../pipes";
import { Authorized, UserRole } from "../auth";
import { IRequestWithUser } from "../auth/interfaces";
import { PaginationDto, paginationSchema } from "../common";

import { MovieRequestDto } from "./dto";
import { MoviesService } from "./movies.service";
import { movieRequestSchema } from "./validations";

@ApiTags("Movies")
@Controller("movies")
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Authorized(UserRole.User)
  @ApiOperation({ description: "Get all own movies" })
  getAll(
    @Req() req: IRequestWithUser,
    @Query(new JoiValidationPipe(paginationSchema)) paginationDto: PaginationDto
  ) {
    return this.moviesService.getMovies(paginationDto, req.user);
  }

  @Get(":id")
  @Authorized(UserRole.User)
  getMovieInfo(@Req() req: IRequestWithUser, @Param("id") id: string) {
    return this.moviesService.getMovieInfo(id, req.user);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Authorized(UserRole.User)
  @UseInterceptors(FileInterceptor("image"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ description: "Create movie record with image file upload" })
  create(
    @Req() req: IRequestWithUser,
    @Body(new JoiValidationPipe(movieRequestSchema))
    createMovieDto: MovieRequestDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: fileConstants.fileSize }),
          new FileTypeValidator({
            fileType: fileConstants.imageMimeTypesRegexp,
          }),
        ],
        fileIsRequired: true,
      })
    )
    image: Express.Multer.File
  ) {
    return this.moviesService.createMovie(createMovieDto, req.user, image);
  }

  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  @Authorized(UserRole.User)
  @UseInterceptors(FileInterceptor("image"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ description: "Update movie record" })
  update(
    @Req() req: IRequestWithUser,
    @Param("id") id: string,
    @Body(new JoiValidationPipe(movieRequestSchema))
    updateMovieDto: MovieRequestDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: fileConstants.fileSize }),
          new FileTypeValidator({
            fileType: fileConstants.imageMimeTypesRegexp,
          }),
        ],
        fileIsRequired: false,
      })
    )
    image: Express.Multer.File
  ) {
    return this.moviesService.updateMovie(id, req.user, updateMovieDto, image);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.OK)
  @Authorized(UserRole.User)
  @ApiOperation({ description: "Delete movie record" })
  delete(@Req() req: IRequestWithUser, @Param("id") id: string) {
    return this.moviesService.deleteMovie(id, req.user);
  }
}
