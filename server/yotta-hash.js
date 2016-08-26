class YottaHasher {
  // Cuts an input string into n blocks of size m. Pads the last block with a
  // filler value to keep every block the same size
  block(str, blockSize = 8, paddingChar = 'A') {
    const blocks = [];
    for (let k = 0; k < str.length; k += blockSize) {
      // If the next chunk isn't going to be "full"
      if (k + blockSize >= str.length) {
        const v =
          str.substr(k, str.length - k) // Get the remaining characters
          + paddingChar.repeat(blockSize - (str.length - k)); // Pad with char
        blocks.push(v);
      } else {
        blocks.push(str.substr(k, blockSize));
      }
    }
    return blocks;
  }

  // Finalize results into full target hash length by distributing it in an
  // algorithmic way, in an effort to achieve an avalanche effect
  finalization(str, length, keySpace) {
    const result = [];

    // Step 1: Initialize
    // Use a pseudo-random generation algorithm (PRGA) to generate the initial
    // resultset
    let i = 0;
    let j = 0;
    let keys = [...keySpace];
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
    // key into the resultset
    j = 0;
    for (let k = 0; k < result.length; k++) {
      j = (j + result[k].charCodeAt(0) + str[k % str.length].charCodeAt(0)) % result.length;
      // Swap i, j
      tmp = result[i];
      result[i] = result[j];
      result[j] = tmp;
    }

    return result.join('');
  }

  // Compression function will accept two blocks and return a new one
  compress(blk1, blk2, keySpace) {
    let result = '';
    for (let k = 0; k < blk1.length; k++) {
      // Attempted the below to make blk1 and blk2 uncommunicative, but the
      // results are unfortunately not as uniform as the addition. Why's this?
      // result += keySpace[Math.floor((10 * blk1.charCodeAt(k)) / blk2.charCodeAt(k)) % keySpace.length];
      result += keySpace[(blk1.charCodeAt(k) + blk2.charCodeAt(k)) % keySpace.length];
    }
    return result;
  }

  // One-way hashing function, per the Merkle-Damgård construction
  yottacize(input) {
    const TARGET_LEN = 2083;
    // const KEY_SPACE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
    const KEY_SPACE = 'YOTTAyotta'.split('');

    console.log('1. string blocked into', block(input));
    const workingBlocks = [...block(input)]; // Create a working copy we can mutate
    let temp;
    // Collapse all blocks into one by applying the first block to the next until
    // there's only one left
    while (workingBlocks.length !== 1) {
      // Delete first element and save its value
      temp = workingBlocks.shift();
      workingBlocks[0] = compress(temp, workingBlocks[0], KEY_SPACE);
    }
    console.log('2. blocks compressed into', workingBlocks);

    const result = finalization(workingBlocks[0], TARGET_LEN, KEY_SPACE);
    console.log('3. finalization function applied to create', result);

    return result;
  }
};


module.exports = YottaHasher;
