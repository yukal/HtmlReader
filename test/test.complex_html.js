'use strict';

const HtmlReader = require('../src');
const checkData = {};

before(async () => {
  const Fs = require('fs');
  const Path = require('path');

  const PATH_DATA = Path.join(process.cwd(), './test/data');
  const htmlFilePath = Path.join(PATH_DATA, '1.html');

  checkData.htmlContent = await Fs.promises.readFile(htmlFilePath, 'utf8');
});

describe('TODO: Complex HTML', () => {
  let parser;

  before(() => {
    parser = HtmlReader.from(checkData.htmlContent);
  });

  afterEach(() => {
    parser.flushResults();
  });

  // TODO: all test cases
  it.skip('tests', () => {});
});
