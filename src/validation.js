'use strict';

const Tag = require('./Tag');

/**
 * Checking for HTML Structure Corruption
 * @param {string} html HTML text
 * @returns array
 */
const checkTreeIntegrity = (html) => {
  const errors = [];
  const treeMap = {};

  let treeDepth = 0;
  let cursorPos = 0;

  html = html.toLowerCase();

  let matches = Tag.regex.wholeTag(html);

  while (matches !== null) {
    const [wholeMatch, openingSign, tagName, tagParams, closingSign] = matches;

    // hack: skip comments <!-- ... -->
    if (wholeMatch.startsWith(Tag.COMMENT_BEGIN) && !wholeMatch.endsWith(Tag.COMMENT_END)) {
      const endCommentPos = html.indexOf(Tag.COMMENT_END, cursorPos);

      cursorPos = endCommentPos + Tag.COMMENT_END.length;
      matches = Tag.regex.wholeTag(html.slice(cursorPos));

      continue;
    }

    const isSingle = Tag.isSingle(tagName);
    cursorPos += matches.index + wholeMatch.length;

    if (openingSign === Tag.OPENING) {
      // Processing paired tags
      if (!isSingle) {
        treeMap[treeDepth] = tagName;
        treeDepth++;
      }
    }

    if (openingSign === Tag.CLOSING_PAIRED) {
      treeDepth--;

      const expectedTagName = treeMap[treeDepth];

      if (tagName === expectedTagName) {
        delete treeMap[treeDepth];
      } else {
        const beginTagPos = cursorPos - wholeMatch.length;
        const prevTagName = treeMap[treeDepth - 1];

        if (tagName === prevTagName) {
          delete treeMap[treeDepth];
          delete treeMap[--treeDepth];

          // ERROR:
          const errorMessage = `Missed closing tag </${expectedTagName}> at position ${beginTagPos}`;
          errors.push(errorMessage);
        } else {
          treeDepth++;

          // ERROR
          const errorMessage = `Missed opening tag <${tagName}> at position ${beginTagPos}`;
          errors.push(errorMessage);
        }
      }
    }

    matches = Tag.regex.wholeTag(html.slice(cursorPos));
  }

  return errors;
}

module.exports = {
  checkTreeIntegrity
};
