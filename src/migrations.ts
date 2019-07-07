import { Singleton, Inject } from 'typescript-ioc';
import { UserMigrator } from './user/user.migrations';
import { BaseMigrator } from './common/base.migrations';
import { BaseEntity } from './common/base.model';

@Singleton
export class MigrationManager {

    @Inject
    userMigration!: UserMigrator;

    public async doMigrations() {
        // overall stats
        let totalUpdated = 0;
        const startTime = new Date();

        /* Migrations */
        console.log('Starting entity migrations...');

        totalUpdated += await this._doMigration(this.userMigration, 'Users');
        // totalUpdated += await this._doMigration(this.userMigration, 'Users');
        // totalUpdated += await this._doMigration(this.userMigration, 'Users');
        // totalUpdated += await this._doMigration(this.userMigration, 'Users');

        /* End logs */
        this._dispLogs('Total', totalUpdated, startTime);
        console.log(`Entity migrations done`);
    }

    /**
     * Do the migration of an entity type with a given migrator
     * and display the logs in the console
     * @param migrator the migrator to use
     * @param entity the name of the entity to display in the logs
     */
    private async _doMigration<T extends BaseEntity>(migrator: BaseMigrator<T>, entity: string): Promise<number> {
        const startTime = new Date();
        const nbUpdated = (await migrator.doMigrations()).length;
        this._dispLogs(entity, nbUpdated, startTime);
        return nbUpdated;
    }

    /**
     * Display the logs after an entity migration
     * @param entity the entity type being migrated
     * @param nbUpdated the number of entity updated
     * @param startTime the starting time of the migration
     */
    private _dispLogs(entity: string, nbUpdated: number, startTime: Date) {
        const duration = new Date().getTime() - startTime.getTime();
        console.log(`${entity}: ${nbUpdated} updated (${duration} ms)`);
    }
}
