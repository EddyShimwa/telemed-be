import { MigrationInterface, QueryRunner } from 'typeorm';

export class DbMigration1732533188856 implements MigrationInterface {
  name = 'DbMigration1732533188856';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "otp" character varying, "otpExpiresAt" TIMESTAMP, "registration_key" character varying NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "password" text NOT NULL, "confirmPassword" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying(1000), "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "securables" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "route" character varying NOT NULL, "description" character varying NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_66fa03e891b81079ba1e8681da5" UNIQUE ("route"), CONSTRAINT "PK_3e9d22a789a9e8a5171ce9ec96a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "menus" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "icon" text NOT NULL, "description" text NOT NULL, "ordering" integer NOT NULL, "securable_id" uuid, "parent_id" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_securables" ("role_id" uuid NOT NULL, "securable_id" uuid NOT NULL, CONSTRAINT "PK_258c6e2f82b35cc9a3b63f4bbe0" PRIMARY KEY ("role_id", "securable_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "permissions" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_bd26f80ff68ee40a7d3161e3e51" PRIMARY KEY ("user_id", "role_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_03f05d2567b1421a6f294d69f4" ON "permissions" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f10931e7bb05a3b434642ed279" ON "permissions" ("role_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f3e7f0359d3020c6f0d21655f0" ON "role_securables" ("role_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2c446c5ce708435ae56bcb2a38" ON "role_securables" ("securable_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ADD CONSTRAINT "FK_2f361de4b9292fd3b7d745de100" FOREIGN KEY ("securable_id") REFERENCES "securables"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ADD CONSTRAINT "FK_00ccc1ed4e9fc23bc1246269359" FOREIGN KEY ("parent_id") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_securables" ADD CONSTRAINT "FK_f3e7f0359d3020c6f0d21655f0a" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_securables" ADD CONSTRAINT "FK_2c446c5ce708435ae56bcb2a38e" FOREIGN KEY ("securable_id") REFERENCES "securables"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD CONSTRAINT "FK_f10931e7bb05a3b434642ed2797" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD CONSTRAINT "FK_03f05d2567b1421a6f294d69f45" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP CONSTRAINT "FK_03f05d2567b1421a6f294d69f45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP CONSTRAINT "FK_f10931e7bb05a3b434642ed2797"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_securables" DROP CONSTRAINT "FK_2c446c5ce708435ae56bcb2a38e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_securables" DROP CONSTRAINT "FK_f3e7f0359d3020c6f0d21655f0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" DROP CONSTRAINT "FK_00ccc1ed4e9fc23bc1246269359"`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" DROP CONSTRAINT "FK_2f361de4b9292fd3b7d745de100"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2c446c5ce708435ae56bcb2a38"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f3e7f0359d3020c6f0d21655f0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f10931e7bb05a3b434642ed279"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_03f05d2567b1421a6f294d69f4"`,
    );
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP TABLE "role_securables"`);
    await queryRunner.query(`DROP TABLE "menus"`);
    await queryRunner.query(`DROP TABLE "securables"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
