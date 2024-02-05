import { ApiProperty } from "@nestjs/swagger";

export class PaginationResponseDto<T> {
  constructor(data: T[], page: number, perPage: number, total: number) {
    this.data = data;
    this.total = Number(total);
    this.page = Number(page);
    this.perPage = Number(perPage);
  }

  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly perPage: number;

  @ApiProperty()
  readonly total: number;
}
