import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { AuditEntity } from "../../common";

import type { User } from "../../users/entities";

@ApiTags("Movies")
@Entity({ name: "movies" })
export class Movie extends AuditEntity {
  constructor(partial: Partial<Movie>) {
    super();
    Object.assign(this, partial);
  }

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ name: "publish_year" })
  publishYear: number;

  @ApiProperty({ nullable: true })
  @Column({ type: String, name: "poster_image_uri" })
  posterImageUri?: string | null;

  @ApiProperty()
  @ManyToOne("User")
  @JoinColumn({ name: "user_id" })
  user: User;
}
