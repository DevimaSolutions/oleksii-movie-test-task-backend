import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { BaseEntity } from "./entities";

@Injectable()
export class ElementaryRepository<
  Entity extends BaseEntity
> extends Repository<Entity> {}
