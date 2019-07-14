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

export function fakeGet(url: string): request.Test {
    const httpRequest = request(app).get(url);
    return _fakeRequest(httpRequest);
}

export function fakePost(url: string, body: any): request.Test {
    const httpRequest = request(app).post(url)
                                    .send(body);
    return _fakeRequest(httpRequest);
}

function _fakeRequest(req: request.Test) {
    return req.set('Accept', 'application/json')
              .set('Origin', 'http://localhost:3000');
}
