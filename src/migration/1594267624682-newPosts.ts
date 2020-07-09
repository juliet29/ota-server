import {MigrationInterface, QueryRunner} from "typeorm";

export class newPosts1594267624682 implements MigrationInterface {
    name = 'newPosts1594267624682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "base_post" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "imageUrl" character varying NOT NULL, "timeSubmitted" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_ecb0db2bad95fb0b9f8de0adadd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "artist_post" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "imageUrl" character varying NOT NULL, "timeSubmitted" TIMESTAMP NOT NULL DEFAULT now(), "artistId" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_04ab30954ee3a34f1b873574bf1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "album_post" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "imageUrl" character varying NOT NULL, "timeSubmitted" TIMESTAMP NOT NULL DEFAULT now(), "albumId" character varying NOT NULL, "rating" integer NOT NULL, "artistNames" text NOT NULL, "userId" integer, CONSTRAINT "PK_0cebed2714233ff528afb7414d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "track_post" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "imageUrl" character varying NOT NULL, "timeSubmitted" TIMESTAMP NOT NULL DEFAULT now(), "trackId" character varying NOT NULL, "vote" integer NOT NULL, "artistNames" text NOT NULL, "userId" integer, CONSTRAINT "PK_7fb02ef90fc76e63a38a1102850" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "spotifyId"`);
        await queryRunner.query(`ALTER TABLE "base_post" ADD CONSTRAINT "FK_693a48afef3c075e3db671502d5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "artist_post" ADD CONSTRAINT "FK_9063a597bc04e16d4bbc79f4a8b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album_post" ADD CONSTRAINT "FK_b3cd2a0a735562e74b33f7e1cb9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_post" ADD CONSTRAINT "FK_d1d8fd9e13261c097a9c30691de" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track_post" DROP CONSTRAINT "FK_d1d8fd9e13261c097a9c30691de"`);
        await queryRunner.query(`ALTER TABLE "album_post" DROP CONSTRAINT "FK_b3cd2a0a735562e74b33f7e1cb9"`);
        await queryRunner.query(`ALTER TABLE "artist_post" DROP CONSTRAINT "FK_9063a597bc04e16d4bbc79f4a8b"`);
        await queryRunner.query(`ALTER TABLE "base_post" DROP CONSTRAINT "FK_693a48afef3c075e3db671502d5"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "spotifyId" text`);
        await queryRunner.query(`DROP TABLE "track_post"`);
        await queryRunner.query(`DROP TABLE "album_post"`);
        await queryRunner.query(`DROP TABLE "artist_post"`);
        await queryRunner.query(`DROP TABLE "base_post"`);
    }

}
