const stream = require('stream');
const fs = require('fs');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.count = 0;
  }
  getBinarySize(chunk, encoding) {
    if (encoding !== 'buffer') {
      return Buffer.byteLength(chunk, 'utf8');
    }
    return chunk.length;
  }

  _transform(chunk, encoding, callback) {
    this.count += this.getBinarySize(chunk, encoding);
    if ( this.count > this.limit) {
      return callback(new LimitExceededError());
    }
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
