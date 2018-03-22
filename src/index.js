const createMDPlugin = (config = {}) => {
  return {
    handleReturn(ev, editorState, { setEditorState }) {
      console.log('ev', ev);
      return 'not-handled';
    },
  };
};

export default createMDPlugin;
