import { ApiProperty } from "@nestjs/swagger";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";

import { BaseEntity } from "./base.entity";

export class AuditEntity extends BaseEntity {
  @ApiProperty()
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
