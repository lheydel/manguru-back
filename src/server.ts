import app from './router';
import { APP_PORT } from './config/app';
import { MigrationManager } from './migrations';

// start serv
app.listen(APP_PORT, async () => {
    // entity migrations
    const migrationManager = new MigrationManager();
    await migrationManager.doMigrations();

    console.log('app started');
});
