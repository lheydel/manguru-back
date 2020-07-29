import { environment } from './config/app';
import { mikroInit } from './config/mikro';
import { MigrationManager } from './migrations';
import app from './router';

// start serv
app.listen(environment.app_port, async () => {
    // setup orm
    await mikroInit();

    // entity migrations
    const migrationManager = new MigrationManager();
    await migrationManager.doMigrations();

    console.log('app started');
});
