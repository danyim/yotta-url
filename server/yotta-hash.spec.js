import test from 'ava';
import yottacize from './yotta-hash';

test('should take an input and return a larger hash value', t => {
  const input = 'test string';
  const result = yottacize(input);
  t.true(input.length < result.length)
});
