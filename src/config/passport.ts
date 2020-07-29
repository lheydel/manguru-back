import passport from 'passport';
import { ExtractJwt, Strategy as JWTStrategy, StrategyOptions } from 'passport-jwt';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { Request } from 'express';

const userService = new UserService();

/* JWT Strategy */
const jwtExtractor = (req: Request) => {
    // get cookies from request
    let cookieString = '';
    if (req && req.headers) {
        cookieString = req.headers.cookie || '';
    }

    // stop if no cookie found
    if (cookieString.trim().length === 0) {
        return '';
    } // else

    // split cookies and find the Authorization
    const cookies = cookieString.split('; ');
    const authRegex = /Authorization=/;
    const authIdx = cookies.findIndex(cookie => cookie.match(authRegex));

    // stop if not found
    if (authIdx < 0) {
        return '';
    } // else

    // return the jwt
    return cookies[authIdx].replace(authRegex, '');
};

const opts: StrategyOptions = {
    jwtFromRequest: jwtExtractor,
    secretOrKey: process.env.JWT_SECRET || 'DEFAULT',
};

passport.use(new JWTStrategy(opts, async (payload, done) => {
    try {
        const user = await userService.getUserById(payload.id);
        return done(null, user || false);
    } catch (err) {
        // server error
        console.error(err.message);
        return done(err.message);
    }
}));

export const jwtAuth = passport.authenticate('jwt', { session: false });

export const jwtAuthOnly = passport.authenticate('jwt', { session: false }, (err: Error, user: User) => {
});

export default passport;
