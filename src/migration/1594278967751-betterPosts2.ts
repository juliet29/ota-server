import {MigrationInterface, QueryRunner} from "typeorm";

export class betterPosts21594278967751 implements MigrationInterface {
    name = 'betterPosts21594278967751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "artist_post" ("id" SERIAL NOT NULL, "timeSubmitted" TIMESTAMP NOT NULL DEFAULT now(), "text" character varying NOT NULL, "imageUrl" character varying NOT NULL, "artistId" character varying NOT NULL, "artistName" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_04ab30954ee3a34f1b873574bf1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "album_post" ("id" SERIAL NOT NULL, "timeSubmitted" TIMESTAMP NOT NULL DEFAULT now(), "text" character varying NOT NULL, "imageUrl" character varying NOT NULL, "albumId" character varying NOT NULL, "rating" integer NOT NULL, "artistNames" text NOT NULL, "albumName" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_0cebed2714233ff528afb7414d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "track_post" ("id" SERIAL NOT NULL, "timeSubmitted" TIMESTAMP NOT NULL DEFAULT now(), "text" character varying NOT NULL, "imageUrl" character varying NOT NULL, "trackId" character varying NOT NULL, "vote" integer NOT NULL, "artistNames" text NOT NULL, "trackName" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_7fb02ef90fc76e63a38a1102850" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "artist_post" ADD CONSTRAINT "FK_9063a597bc04e16d4bbc79f4a8b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album_post" ADD CONSTRAINT "FK_b3cd2a0a735562e74b33f7e1cb9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_post" ADD CONSTRAINT "FK_d1d8fd9e13261c097a9c30691de" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track_post" DROP CONSTRAINT "FK_d1d8fd9e13261c097a9c30691de"`);
        await queryRunner.query(`ALTER TABLE "album_post" DROP CONSTRAINT "FK_b3cd2a0a735562e74b33f7e1cb9"`);
        await queryRunner.query(`ALTER TABLE "artist_post" DROP CONSTRAINT "FK_9063a597bc04e16d4bbc79f4a8b"`);
        await queryRunner.query(`DROP TABLE "track_post"`);
        await queryRunner.query(`DROP TABLE "album_post"`);
        await queryRunner.query(`DROP TABLE "artist_post"`);
    }

}
