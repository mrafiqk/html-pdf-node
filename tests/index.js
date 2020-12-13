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

  it('convert-html-to-pdf-with-args', function(done) {
    html.generatePdf({ url: 'https://www.google.com/' }, { format: 'A4', args: ['--no-sandbox'] }, function(err, result) {
      expect(err).to.be.null;
      expect(result).to.be.an.instanceOf(Buffer);
      done();
    });
  });
});

describe('convert-array-of-htmls-to-pdfs', function() {
  it('returns promise', function() {
    let promise = html.generatePdfs([{ content: file }], { format: 'A4' });
    expect(promise.then).to.be.an.instanceof(Function);
  });

  it('convert-html-to-pdf-with-callback', function(done) {
    html.generatePdfs([{ content: file }], { format: 'A4' }, function(err, result) {
      expect(err).to.be.null;
      expect(result).to.be.an.instanceOf(Array);
      expect(result[0]).to.be.an.instanceOf(Object);
      expect(result[0].buffer).to.be.an.instanceOf(Buffer);
      done();
    });
  });

  it('convert-html-to-pdf-with-url', function(done) {
    html.generatePdfs([{ url: 'https://www.google.com/' }], { format: 'A4' }, function(err, result) {
      expect(err).to.be.null;
      expect(result).to.be.an.instanceOf(Array);
      expect(result[0]).to.be.an.instanceOf(Object);
      expect(result[0].buffer).to.be.an.instanceOf(Buffer);
      done();
    });
  });

  it('convert-html-to-pdf-with-args', function(done) {
    html.generatePdfs([{ url: 'https://www.google.com/' }], { format: 'A4', args: ['--no-sandbox'] }, function(err, result) {
      expect(err).to.be.null;
      expect(result).to.be.an.instanceOf(Array);
      expect(result[0]).to.be.an.instanceOf(Object);
      expect(result[0].buffer).to.be.an.instanceOf(Buffer);
      done();
    });
  });
});
