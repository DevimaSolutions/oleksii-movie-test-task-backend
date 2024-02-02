import * as Joi from 'joi';

import { SignUpDto } from '../dto';

export const signUpSchema = Joi.object<SignUpDto>({
  email: Joi.string().trim().email().required().max(255),
  password: Joi.string().trim().min(8).required(),
});
