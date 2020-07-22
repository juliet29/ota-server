import {MigrationInterface, QueryRunner} from "typeorm";

export class betterPosts31594740684893 implements MigrationInterface {
    name = 'betterPosts31594740684893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "base_post" ADD "externalUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "artist_post" ADD "externalUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "album_post" ADD "externalUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "track_post" ADD "externalUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track_post" DROP COLUMN "externalUrl"`);
        await queryRunner.query(`ALTER TABLE "album_post" DROP COLUMN "externalUrl"`);
        await queryRunner.query(`ALTER TABLE "artist_post" DROP COLUMN "externalUrl"`);
        await queryRunner.query(`ALTER TABLE "base_post" DROP COLUMN "externalUrl"`);
    }

}
