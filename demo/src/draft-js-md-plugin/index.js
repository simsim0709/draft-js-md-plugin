import React from 'react';

import { EditorState, Modifier } from 'draft-js';

import blockStrategy from './blockStrategy';

const getCurrentText = editorState => {
  const selection = editorState.getSelection();
  const key = selection.getStartKey();

  return editorState
    .getCurrentContent()
    .getBlockForKey(key)
    .getText();
};

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
      const currentContent = editorState.getCurrentContent();
      const selection = editorState.getSelection();

      const newEditorState = EditorState.push(
        editorState,
        Modifier.setBlockType(currentContent, selection, 'header-one'),
        'change-block-type'
      );

      setEditorState(newEditorState);

      return 'handled';
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
