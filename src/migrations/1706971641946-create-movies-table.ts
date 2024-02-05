import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class createMoviesTable1706971641946 implements MigrationInterface {
  name = "createMoviesTable1706971641946";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "movies",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: `uuid_generate_v4()`,
          },
          { name: "user_id", type: "uuid", isNullable: false },
          { name: "title", type: "varchar", isNullable: false },
          { name: "publish_year", type: "int", isNullable: false },
          { name: "poster_image_uri", type: "varchar", isNullable: true },
          {
            name: "created_at",
            type: "timestamp",
            isNullable: false,
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            isNullable: false,
            default: "now()",
          },
        ],
        indices: [
          new TableIndex({
            name: "IDX_MOVIES_USER_TITLE_PUBLISH_YEAR",
            columnNames: ["user_id", "title", "publish_year"],
            isUnique: true,
          }),
        ],
        foreignKeys: [
          {
            name: "movies_user_id_fkey",
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("movies");
  }
}
