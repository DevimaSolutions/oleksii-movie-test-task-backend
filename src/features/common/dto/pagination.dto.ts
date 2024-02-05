import { ApiPropertyOptional } from "@nestjs/swagger";

import { defaultPage, defaultPerPage } from "../constants";

export class PaginationDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    type: "number",
  })
  page = defaultPage;

  @ApiPropertyOptional({
    minimum: 1,
    default: 8,
    type: "number",
  })
  perPage = defaultPerPage;
}
