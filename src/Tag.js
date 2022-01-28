'use strict';

const Tag = {};

Tag.POS_CONTNENT_START = 0;
Tag.POS_CONTNENT_END = 1;
Tag.POS_START = 2;
Tag.POS_END = 3;

Tag.COMMENT_BEGIN = '<!--';
Tag.COMMENT_END = '-->';

Tag.CLOSING_PAIRED = '</';
Tag.CLOSING_SINGLE = '/>';
Tag.OPENING = '<';
Tag.CLOSING = '>';

// Tag.OPENING = String.fromCharCode(0x3c);
// Tag.CLOSING = String.fromCharCode(0x3e);

Tag.regex = {
  wholeTag: (html) => {
    const regex = /(?<openingSign><[!\/-]?)(?<tagName>[\w-]+)(?<tagParams>[^>]*?)(?<closingSign>[-\/]*>)/gm;
    return typeof html === 'string' ? regex.exec(html) : regex;
  },

  // attributes: (html) => {
  //   const regex = /(?<name>[\w]+)=["'](?<value>[^'"]+)['"]/img;
  //   return typeof html === 'string' ? regex.exec(html) : regex;
  // }
};

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element
 */
Tag.singleList = new Set([
  'doctype',
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'rb',
  'source',
  'track',
  'wbr',
]);

/**
 * isSingleTag
 * @see SingleTags
 * @param {String} tagName Tag name
 * @returns {boolean}
 */
Tag.isSingle = (tagName) => Tag.singleList.has(tagName);

module.exports = Object.freeze(Tag);
