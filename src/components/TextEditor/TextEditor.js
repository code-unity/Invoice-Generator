import React, { Component, useEffect } from "react";
import { useState } from "react";
import { Fragment } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: "75%",
  },
  editor: {
    backgroundColor: "white",
  },
}));

const TextEditor = (props) => {
  const classes = useStyles();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    const emptyState = EditorState.createEmpty();
    setEditorState(emptyState);
  }, [props.isEmpty]);

  const editorStateChangeHandler = (state) => {
    setEditorState(state);
    props.getHtml(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };
  return (
    <Fragment>
      <Editor
        editorState={editorState}
        onEditorStateChange={editorStateChangeHandler}
        wrapperClassName={classes.wrapper}
        editorClassName={classes.editor}
      ></Editor>
    </Fragment>
  );
};
export default TextEditor;
