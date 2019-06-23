import { Request, Response } from 'express';

// test
export const getName = (req: Request, res: Response) => {
    res.send('Larry Golade');
};