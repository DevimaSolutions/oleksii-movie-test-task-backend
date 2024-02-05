import { ApiProperty } from "@nestjs/swagger";

import { Movie } from "../entities";

export class MovieDto {
  constructor({ id, title, publishYear, posterImageUri }: Movie) {
    this.id = id;
    this.title = title;
    this.publishYear = publishYear;
    this.title = title;
    this.posterImageUri = posterImageUri ?? null;
  }

  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  publishYear: number;

  @ApiProperty()
  posterImageUri: string | null;
}
