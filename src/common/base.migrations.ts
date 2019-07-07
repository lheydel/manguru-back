import { BaseEntity } from './base.model';
import { User } from '../user/user.model';

export interface BaseMigrator<T extends BaseEntity> {
    doMigrations(): Promise<T[]>;
    needMigration(entity: T): boolean;
    upgradeVersionStruct(entity: T): void;
}
