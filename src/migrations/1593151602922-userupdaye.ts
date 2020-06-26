import {MigrationInterface, QueryRunner} from "typeorm";

export class userupdaye1593151602922 implements MigrationInterface {
    name = 'userupdaye1593151602922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "spotifyId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "spotifyId" text`);
    }

}
