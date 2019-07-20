import request from 'supertest';
import app from '../src/router';

/**
 * Generate a fake id from a real one as a base (to make sure it's a valid one)
 * @param id the id used as a base for the fake
 * @return a fake id based on the given one
 */
export function fakeId(id: string): string {
    const fakeChar = (id.charAt(0) === 'a' ? '0' : 'a');
    return fakeChar + id.slice(1);
}

/**
 * Create and configure a supertest GET request
 * @param url the url to adress the request to
 * @param cookies the cookies to set into the request
 */
export function fakeGet(url: string, cookies?: string): request.Test {
    const httpRequest = request(app).get(url);
    httpRequest.cookies = cookies || '';
    console.log('Cookies: ' + cookies);
    return _fakeRequest(httpRequest);
}

/**
 * Create and configure a supertest POST request
 * @param url the url to adress the request to
 * @param body the body of the request
 * @param cookies the cookies to set into the request
 */
export function fakePost(url: string, body: any): request.Test {
    const httpRequest = request(app).post(url)
                                    .send(body);
    return _fakeRequest(httpRequest);
}

/**
 * Configure a given supertest request with common parameters
 * @param req the request to configure
 */
function _fakeRequest(req: request.Test) {
    return req.set('Accept', 'application/json')
              .set('Origin', 'http://localhost:3000')
              .withCredentials();
}

/**
 * Extract the cookies of a supertest request
 * (origin: https://gist.github.com/the-vampiire/a564af41ed0ce8eb7c30dbe6c0f627d8)
 * @param headers the headers of the request
 */
export function extractCookies(headers: any) {
    const cookies: string[] = headers['set-cookie']; // Cookie[]

    return cookies.reduce((shapedCookies, cookieString) => {
        const [rawCookie, ...flags] = cookieString.split('; ');
        const [cookieName, value] = rawCookie.split('=');
        return { ...shapedCookies, [cookieName]: { value, flags: _shapeFlags(flags) } };
    }, {});
}

/**
 *  (origin: https://gist.github.com/the-vampiire/a564af41ed0ce8eb7c30dbe6c0f627d8)
 */
function _shapeFlags(flags: string[]) {
    flags.reduce((shapedFlags, flag) => {
        const [flagName, rawValue] = flag.split('=');
        // edge case where a cookie has a single flag and "; " split results in trailing ";"
        const value = rawValue ? rawValue.replace(';', '') : true;
        return { ...shapedFlags, [flagName]: value };
    }, {});
}
