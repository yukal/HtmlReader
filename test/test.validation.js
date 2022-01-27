'use strict';

const { expect } = require('chai');
const Validation = require('../src/validation');
const checkData = {};

before(async () => {
  const Fs = require('fs');
  const Path = require('path');

  const PATH_DATA = Path.join(process.cwd(), './test/data');
  const htmlFilePath = Path.join(PATH_DATA, 'corrupted.html');

  checkData.htmlContent = await Fs.promises.readFile(htmlFilePath, 'utf8');
});

describe('Validation', () => {
  it('checkTreeIntegrity()', () => {
    const results = Validation.checkTreeIntegrity(checkData.htmlContent);

    const expected = [
      'Missed closing tag </td> at position 422',
      'Missed opening tag <form> at position 488'
    ]

    expect(results).lengthOf(2);
    expect(results[0]).equal(expected[0]);
    expect(results[1]).equal(expected[1]);
  });
});
