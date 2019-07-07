import { sum } from '../src/index';

test('1 + 2 is 3', () => {
    expect(sum(1, 2)).toEqual(3);
});

test('throw if null', () => {
    expect(() => sum(undefined, undefined)).toThrow();
});

// test async
// await expect(fetchData()).resolves.toBe('peanut butter');
// await expect(fetchData()).rejects.toThrow('error');
