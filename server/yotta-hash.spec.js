import test from 'ava';
import yotta from './yotta-hash';

test('should take an input and return a larger hash value', t => {
  const input = 'test string';
  const result = yotta.yottacize(input);
  t.true(input.length < result.length)
});

test('should split an input string to n blocks', t => {
  const sz = 5;
  const input = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
  const result = yotta.block(input, sz);
  t.true(Math.floor(input.length / 5) + 1 === result.length);
  t.true(result[0] === input.substr(0, sz));
  t.true(result[1] === input.substr(sz, sz));
});

test('should compress n blocks into one', t => {
  const sz = 5;
  const keySpace = 'abc';
  const input1 = 'test';
  const input2 = 'cool';

  const result = yotta.compress(input1, input2, keySpace);
  t.true(result[0] !== input1 || result[0] !== input2);
  // t.true(result.every(x => x.replace(/[abc]+/g, '') === '') === true);
});

test('should hash to different values', t => {
  const test1 = yotta.yottacize('http://google.com');
  const test2 = yotta.yottacize('http://google.com/');
  t.true(test1 !== test2);
});
