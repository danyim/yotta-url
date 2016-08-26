// Although 2083 is the max length allowed for a URL (thanks to the kind
// folks on the IE team), we need some room for the microservice URL where the
// key will attach to.
// Common use cases will be "http://localhost:1104/" (default URL: 22 chars)
// or a Heroku deployment "https://red-ocean-sky.herokuapp.com/" (36 chars).
// We'll play it safe and leave 45 characters for the host:
const TARGET_LEN = 2083 - 45;
const BLOCK_SIZE = 26;
const KEY_SPACE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
// const KEY_SPACE = 'YOTTAyotta'.split('');

/**
 * Cuts an input string into n blocks of size m. Pads the last block with a
 * filler value to keep every block the same size
 * @param  {String} str         Input string
 * @param  {Number} blockSize   Size of block
 * @param  {String} paddingChar Padding character
 * @return {Array}              Array of blocks
 */
const block = (str, blockSize, paddingChar = 'A') => {
  const blocks = [];
  for (let k = 0; k < str.length; k += blockSize) {
    // If the next block isn't going to be full
    if (k + blockSize >= str.length) {
      // We want to pad the remaining values
      const v =
        str.substr(k, str.length - k) // Get the remaining characters
        + paddingChar.repeat(blockSize - (str.length - k)); // Pad with char
      blocks.push(v);
      // TODO: When padding, use a different value for the first pad and
      // add the length of the key to the end of the block. Adding those
      // features will improve the cryptographic strength.
    } else if (k + blockSize === str.length) {
      blocks.push(str.substr(k, blockSize));
    } else {
      blocks.push(str.substr(k, blockSize));
    }
  }
  return blocks;
};

/**
 * The compression function will accept two blocks and return a new one
 * @param  {String} blk1     First block
 * @param  {String} blk2     Second block
 * @param  {Array}  keySpace Available keys to pick from
 * @return {String}          New block
 */
const compress = (blk1, blk2, keySpace) => {
  let result = '';
  for (let k = 0; k < blk1.length; k++) {
    // Attempted the below to make blk1 and blk2 uncommunicative, but the
    // results are unfortunately not as uniform as plain addition. Why's this?
    // result += keySpace[Math.floor((10 * blk1.charCodeAt(k)) / blk2.charCodeAt(k)) % keySpace.length];
    result += keySpace[(blk1.charCodeAt(k) + blk2.charCodeAt(k)) % keySpace.length];
  }
  return result;
};

/**
 * Finalize results into full target hash length by distributing it in an
 * algorithmic way, in an effort to achieve an avalanche effect
 * @param  {String} key      The final block after compression
 * @param  {Number} length   Length of the resultant hash
 * @param  {Array}  keySpace Array of values to pick from
 * @return {String}          Final hash value
 */
const finalization = (key, length, keySpace) => {
  const result = [];

  // Step 1: Initialize
  // Use a pseudo-random generation algorithm (PRGA) to generate the initial
  // resultset using the keyspace alone
  let i = 0;
  let j = 0;
  const keys = [...keySpace];
  let tmp;
  while (result.length !== length) {
    i = (i + 1) % keys.length;
    j = (j + keys[i].charCodeAt(0)) % keys.length;
    // Swap i, j
    tmp = keys[i];
    keys[i] = keys[j];
    keys[j] = tmp;
    result.push(keys[(keys[i].charCodeAt(0) + keys[j].charCodeAt(0)) % keys.length]);
  }

  // Step 2: Mutate
  // Use a key-scheduling algorithm (KSA) to pseudo-randomly distribute the
  // key (the final block) into the resultset
  j = 0;
  for (let k = 0; k < result.length; k++) {
    j = (j + result[k].charCodeAt(0) + key[k % key.length].charCodeAt(0)) % result.length;
    // Swap i, j
    tmp = result[i];
    result[i] = result[j];
    result[j] = tmp;
  }

  return result.join('');
};

/**
 * One-way hashing function, per the Merkle-Damgård construction
 * @param  {String} input Input string
 * @return {String}       Hashed value
 */
const yottacize = input => {
  if (input === undefined || input.length === 0) {
    throw Error('No input provided');
  }
  const blocks = block(input, BLOCK_SIZE);
  console.log(`1. string blocked (blksz: ${BLOCK_SIZE}) into`, blocks);

  const workingBlocks = [...blocks]; // Create a working copy we can mutate
  let temp;
  let str = '';
  // Collapse all blocks into one by applying the first block to the next until
  // there's only one left
  while (workingBlocks.length !== 1) {
    // Delete first element and save its value
    temp = workingBlocks.shift();
    workingBlocks[0] = compress(temp, workingBlocks[0], KEY_SPACE);
    str += `'${workingBlocks[0]}'${(workingBlocks.length === 1 ? '' : ' => ')}`;
  }
  console.log('2. blocks compressed into', `${str}, final: '${workingBlocks}'`);
  const result = finalization(workingBlocks[0], TARGET_LEN, KEY_SPACE);
  console.log('3. finalization function applied', result);

  return result;
};

module.exports = yottacize;
