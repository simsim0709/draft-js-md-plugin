import React from 'react';

import { EditorState, Modifier, RichUtils } from 'draft-js';

import MarkdownIt from 'markdown-it';

export const every = (text, character) => {
  if (!text || !character) return false;
  let leng = text.length;

  while (leng--) {
    if (text[leng] !== character) return false;
  }

  return true;
};

export const getCurrentBlock = editorState => {
  const selection = editorState.getSelection();
  const key = selection.getStartKey();

  return editorState.getCurrentContent().getBlockForKey(key);
};

export const getCurrentText = editorState => {
  return getCurrentBlock(editorState).getText();
};

export const replaceBlock = (editorState, type) => {
  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const text = getCurrentText(editorState);

  const newSelection = selection.merge({
    anchorOffset: 0,
    focusOffset: text.length,
  });

  const newContent = Modifier.replaceText(currentContent, newSelection, '');

  return EditorState.push(
    editorState,
    Modifier.setBlockType(newContent, newSelection, type),
    // newContent,
    'change-block-type'
  );
};

const headerMap = [
  'header-one',
  'header-two',
  'header-three',
  'header-four',
  'header-five',
  'header-six',
];

const inlineMap = {
  BOLD: [/\*\*([^(?:**)]+)\*\*/g, /__([^(?:__)]+)__/g],
  ITALIC: [/\*([^*]+)\*/g, /_([^_]+)_/g],
  CODE: [/`([^`]+)`/g],
  STRIKETHROUGH: [/~~([^(?:~~)]+)~~/g],
};

// bold: **sss**
// italic: *sim*
// code: `sss`
// strikethrough: ~~sss~~

const md = new MarkdownIt();

export const renderInline = ({ content, selection }, tokens) => {
  const result = tokens.reduce((acc, { type, content }) => {
    Modifier.applyInlineStyle(content, selection, 'BOLD');
    if (type === 'strong_open') {
      return acc + `<strong>`;
    }

    if (type === 'strong_close') {
      return acc + '</strong>';
    }

    return acc + content;
  }, '');

  console.log('result', result);

  return result;
};

console.log('md', md);
const createMDPlugin = (config = {}) => {
  const store = {
    getEditorState: undefined,
    setEditorState: undefined,
  };

  return {
    initialize: ({ getEditorState, setEditorState }) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
    },

    handleBeforeInput(character, editorState, { setEditorState }) {
      const text = getCurrentText(editorState);
      const content = editorState.getCurrentContent();
      const selection = editorState.getSelection();
      console.log(
        'text',
        renderInline({ content, selection }, md.parseInline(text)[0].children)
      );

      // block styles
      if (character !== ' ') {
        return 'not-handled';
      }

      // handle header
      if (text.startsWith('#')) {
        const position = selection.getAnchorOffset();
        const sharps = every(text.slice(0, position > 6 ? 6 : position), '#');

        if (sharps) {
          const i = text.length;
          const header = headerMap[i];
          const newEditorState = replaceBlock(editorState, header);
          setEditorState(newEditorState);

          return 'handled';
        }
      }

      // handle list item
      if (text.startsWith('*')) {
        const newEditorState = replaceBlock(editorState, 'unordered-list-item');
        setEditorState(newEditorState);

        return 'handled';
      }

      if (text.startsWith('1.')) {
        const newEditorState = replaceBlock(editorState, 'ordered-list-item');
        setEditorState(newEditorState);

        return 'handled';
      }

      if (text.startsWith('>')) {
        const newEditorState = replaceBlock(editorState, 'blockquote');
        setEditorState(newEditorState);

        return 'handled';
      }

      return 'not-handled';
    },

    handleReturn(event, editorState, { setEditorState }) {
      const text = getCurrentText(editorState);

      if (text.trim() === '```') {
        const newEditorState = replaceBlock(editorState, 'code-block');

        setEditorState(newEditorState);

        return 'handled';
      }

      return 'not-handled';
    },
  };
};

export default createMDPlugin;

// inline StyleSheet
// block StyleSheet
// custom block, inline style
// custom trigger
//  custom action (only support #, ##)
