import React, { Component } from 'react';

import Editor from 'draft-js-plugins-editor';
import { EditorState } from 'draft-js';
import createMDPlugin from 'draft-js-md-plugin';

import logo from './logo.svg';
import './App.css';

console.log('createMDPlugin', createMDPlugin);

const mdPlugin = createMDPlugin();

// const plugins = [mdPlugin];

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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          // plugins={plugins}
        />
      </div>
    );
  }
}

export default App;
