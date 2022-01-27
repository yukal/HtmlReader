'use strict';

const Tag = require('./Tag');

const HTML_COMMENT_BEGIN = '<!--';
const HTML_COMMENT_END = '-->';

const getReg = () => /<(?<tag>[!\/\w-]+)(?<params>[^>]*?)>/mg;

/**
 * Checking for HTML Structure Corruption
 * @param {string} html HTML text
 * @returns array
 */
const checkTreeIntegrity = (html) => {
  const errors = [];
  const treeMap = {};

  let treeDepth = 0;
  let beginTagPos = 0;

  // Skip !DOCTYPE and start from <html> tag
  let matches = /<\bhtml\b.*?>/i.exec(html);
  let cursorPos = matches !== null ? matches.index : 0;

  matches = getReg().exec(html.slice(cursorPos));

  while (matches !== null) {
    const [wholeMatch, tag, tagParams] = [...matches];

    // Skip comments <!-- ... -->
    if (wholeMatch.startsWith(HTML_COMMENT_BEGIN)) {
      if (!wholeMatch.endsWith(HTML_COMMENT_END)) {
        const lastCommentPos = html.indexOf(HTML_COMMENT_END, cursorPos);
        beginTagPos = cursorPos + matches.index;
        cursorPos = lastCommentPos + HTML_COMMENT_END.length;
      } else {
        cursorPos += matches.index + wholeMatch.length;
        beginTagPos = cursorPos - wholeMatch.length;
      }

      matches = getReg().exec(html.slice(cursorPos));

      continue;
    } else {
      cursorPos += matches.index + wholeMatch.length;
      beginTagPos = cursorPos - wholeMatch.length;
    }

    const tagSign = tag[0];
    const currTagName = (tagSign === '/' ? tag.slice(1) : tag).toLowerCase();
    const isSingle = Tag.isSingle(currTagName);

    if (tagSign !== '/') {
      // Processing paired tags
      if (!isSingle) {
        treeMap[treeDepth] = currTagName;
        treeDepth++;
      }
    }

    else if (tagSign === '/') {
      treeDepth--;

      const expectedTagName = treeMap[treeDepth];

      if (currTagName === expectedTagName) {
        delete treeMap[treeDepth];
      } else {
        const prevTagName = treeMap[treeDepth - 1];

        if (currTagName === prevTagName) {
          delete treeMap[treeDepth];
          delete treeMap[--treeDepth];

          // ERROR:
          const errorMessage = `Missed closing tag </${expectedTagName}> at position ${beginTagPos}`;
          errors.push(errorMessage);
        } else {
          treeDepth++;

          // ERROR
          const errorMessage = `Missed opening tag <${currTagName}> at position ${beginTagPos}`;
          errors.push(errorMessage);
        }
      }
    }

    matches = getReg().exec(html.slice(cursorPos));
  }

  return errors;
}

module.exports = {
  checkTreeIntegrity
};
