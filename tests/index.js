'use strict';

let expect = require('chai').expect;
let html = require('../index');
let fs = require('fs');
const file = fs.readFileSync('./tests/sample.html', 'utf-8')
//  {
//   if (err) {
//         throw err;
//     }
//     const file = data;
// });

describe('convert-html-to-pdf', function() {
  it('returns promise', function() {
    let promise = html.generatePdf({ content: file }, { format: 'A4' });
    expect(promise.then).to.be.an.instanceof(Function);
  });

  it('convert-html-to-pdf-with-callback', function(done) {
    html.generatePdf({ content: file }, { format: 'A4' }, function(err, result) {
      expect(err).to.be.null;
      expect(result).to.be.an.instanceOf(Buffer);
      done();
    });
  });

  it('convert-html-to-pdf-with-url', function(done) {
    html.generatePdf({ url: 'https://www.google.com/' }, { format: 'A4' }, function(err, result) {
      expect(err).to.be.null;
      expect(result).to.be.an.instanceOf(Buffer);
      done();
    });
  });
});
