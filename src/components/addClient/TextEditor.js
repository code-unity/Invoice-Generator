import React, { Component } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
// import "./TextEditor.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default class TextEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
    this.props.getHtml(
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
  };

  render() {
    const { editorState } = this.state;
    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    return (
      <div
        className="parent"
        style={{
          display: "flex",
          justifyContent: "space-around",
          height: "400px",
          width: "100%",
        }}
      >
        <Editor
          editorState={editorState}
          wrapperClassName="wrapper"
          editorClassName="editor"
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}
