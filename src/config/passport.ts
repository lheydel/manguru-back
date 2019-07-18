import passport from 'passport';
import { ExtractJwt, Strategy as JWTStrategy, StrategyOptions } from 'passport-jwt';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

const userService = new UserService();

/* JWT Strategy */
const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'DEFAULT',
};

passport.use(new JWTStrategy(opts, async (payload, done) => {
    try {
        const user = await userService.getUserById(payload.id);
        return done(null, user || false);
    } catch (err) {
        // server error
        console.error(err);
        return done(err);
    }
}));

export const jwtAuth = passport.authenticate('jwt', { session: false });

export const jwtAuthOnly = passport.authenticate('jwt', { session: false }, (err: Error, user: User) => {
});

export default passport;
