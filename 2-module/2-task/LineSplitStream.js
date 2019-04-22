const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.line = '';
  }
  
  _transform(chunk, encoding, callback) {
    this.line += chunk.toString();
    this._sendData();
    callback()
  }

  _sendData() {
    let listElems = this.line.split(`${os.EOL}`);
    listElems.forEach((item, idx) => {
      if (idx === listElems.length - 1) {
        return this.line = item;
      }
      this.push(item);
    })
    
  }
  
  _flush(callback) {
    this.push(this.line);
    callback();
  }
}


module.exports = LineSplitStream;
