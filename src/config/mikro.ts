import { EntityManager, MikroORM, Options } from 'mikro-orm';
import { BaseEntity } from '../common/base.model';
import { User } from '../user/user.model';
import { sync } from 'glob';

const mikro = {} as {
    orm: MikroORM,
    getRepository: typeof EntityManager.prototype.getRepository
};

export const mikroOpt: Options = {
    entities: [
        BaseEntity,
        User,
    ],
    dbName: 'manguru',
    type: 'mongo',
    clientUrl: process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017' : 'mongodb://mongo:27017',
    autoFlush: false,
    baseDir: __dirname,
    // logger: console.log.bind(console),
    // debug: true,
};

export const mikroInit = async () => {
    mikro.orm = await MikroORM.init(mikroOpt);
    mikro.getRepository = mikro.orm.em.getRepository.bind(mikro.orm.em);
};

export default mikro;
