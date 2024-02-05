import * as Joi from "joi";

import { MovieRequestDto } from "../dto";

export const movieRequestSchema = Joi.object<MovieRequestDto>({
  title: Joi.string().trim().required(),
  publishYear: Joi.number().required(),
});
