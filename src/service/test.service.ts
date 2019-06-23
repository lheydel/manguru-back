import { Singleton } from 'typescript-ioc';


@Singleton
export class TestService {

    public blblbl(): String {
        return 'Blblbl!';
    }
}