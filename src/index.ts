import { Request, Response } from 'express';

// home
export const getHome = (req: Request, res: Response) => {
    res.send('Hey!');
};

// about page
export const getAbout = (req: Request, res: Response) => {
    res.send('Eubaoutu');
};

// contact page
export const getContact = (req: Request, res: Response) => {
    res.send('コンタクト');
};

// test
export const sum = (a: number, b: number): number => {
    if (a == null || b == null) { throw Error; }
    return a + b;
};
