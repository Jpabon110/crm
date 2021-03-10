/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  EditorState,
  convertToRaw,
  ContentState,
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


const ToolbarOptions = {
  options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'emoji', 'image', 'history'],
  inline: {
    options: ['bold', 'italic', 'underline'],
  },
};


export default class TextEditorTwo extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  };

  onEditorStateChange = (editorState) => {
    this.setState({ editorState });
  };

  getTextHtml = () => {
    const { editorState } = this.state;
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  }

  setTextHtml = (bodyHTML) => {
    const blocksFromHtml = htmlToDraft(bodyHTML);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const body = EditorState.createWithContent(contentState);
    this.setState({ editorState: body });
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className="text-editor">
        <Editor
          editorState={editorState}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={ToolbarOptions}
        />
      </div>
    );
  }
}
