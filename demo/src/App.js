import React, { Component } from 'react';

import Editor from 'draft-js-plugins-editor';
import { EditorState } from 'draft-js';
import createMDPlugin from './draft-js-md-plugin';

import 'draft-js/dist/Draft.css';
import './App.css';

console.log('createMDPlugin', createMDPlugin);

const mdPlugin = createMDPlugin();

const plugins = [mdPlugin];

class App extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  };

  onChange = editorState => {
    this.setState({
      editorState,
    });
  };

  render() {
    return (
      <div className="App">
        <div style={{
          width: 500,
          height: 300,
          padding: 20,
          margin: '0 auto',
          border: '1px solid #ddd',
        }}>
          <Editor
            placeholder="here..."
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
          />
        </div>
      </div>
    );
  }
}

export default App;
