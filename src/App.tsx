import React, { useState, useEffect, useRef } from 'react'
import { DraftEditorCommand, DraftHandleValue, Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';

const App = () => {
  const [editorEnable, setEditorEnable] = useState<boolean>(false)
  const [editorState, setEditorState] = useState<EditorState>(() => EditorState.createEmpty());
  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    setEditorEnable(true)
  }, [])

  const handleKeyCommand = (
    command: DraftEditorCommand,
    editorState: EditorState,
  ): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  const onBoldClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  }

  return (
    <div onClick={() => { editorRef?.current?.focus() }}>
      {editorEnable && (
        <>
          <button onMouseDown={onBoldClick}>Bold</button>
          <Editor
            ref={editorRef}
            editorState={editorState}
            onChange={(state) => {
              setEditorState(state);
            }}
            handleKeyCommand={handleKeyCommand}
          />
        </>
      )}
    </div>
  )
}

export { App }
