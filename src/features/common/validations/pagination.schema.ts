import * as Joi from "joi";

import { defaultPage, defaultPerPage } from "../constants";
import { PaginationDto } from "../dto";

export const paginationSchema = Joi.object<PaginationDto>({
  page: Joi.number().integer().optional().min(1).default(defaultPage),
  perPage: Joi.number().integer().optional().min(1).default(defaultPerPage),
});
