import { Request, Response } from 'express';
import { TestService } from '../service/test.service';
import { Inject, Singleton } from 'typescript-ioc';

@Singleton
export class UserController {

    @Inject
    private testService: TestService;

    // test
    public getName(req: Request, res: Response) {
        res.send('Larry Golade\n' + this.testService.blblbl());
    }
}

// test
// export const getName = (req: Request, res: Response) => {
//     res.send('Larry Golade');
// };