const createMDPlugin = (config = {}) => {
  return {
    initialize: ({ getEditorState, setEditorState }) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
    },

    handleReturn(ev, editorState, { setEditorState }) {
      console.log('ev', ev);
      return 'not-handled';
    },
  };
};

export default createMDPlugin;
