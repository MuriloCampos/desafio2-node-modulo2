import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class ChangeValueFieldToInteger1587218265650
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'transactions',
      'value',
      new TableColumn({
        name: 'value',
        type: 'integer',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
