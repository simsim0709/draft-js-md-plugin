import React from 'react';

import { EditorState, Modifier, RichUtils } from 'draft-js';

var every = (text, character) => {
  if (!text || !character) return false;
  let leng = text.length;

  while(leng--) {
    if (text[leng] !== character) return false;
  }

  return true;
};

const getCurrentText = editorState => {
  const selection = editorState.getSelection();
  const key = selection.getStartKey();

  return editorState
    .getCurrentContent()
    .getBlockForKey(key)
    .getText();
};

const headerMap = [
  'header-one',
  'header-two',
  'header-three',
  'header-four',
  'header-five',
  'header-six',
];

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
      console.log('character', character);

      if (character !== ' ') {
        return 'not-handled';
      }

      const text = getCurrentText(editorState);

      if (!text.startsWith('#')) {
        return 'not-handled';
      }

      if (text.startsWith('#') && character === ' ') {
        console.log('here', text);
        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const position = selection.getAnchorOffset();
        const sharps = every(text.slice(0, position), '#');

        if (sharps) {
          const i = text.length;

          const header = headerMap[i];

          const newEditorState = EditorState.push(
            editorState,
            Modifier.setBlockType(currentContent, selection, header),
            // newContent,
            'change-block-type'
          );
  
          setEditorState(newEditorState);

          return 'handled';
        }
      }

      return 'not-handled';
    },

    handleReturn(ev, editorState, { setEditorState }) {
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
