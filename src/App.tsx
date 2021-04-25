import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components';
import { DraftBlockType, DraftEditorCommand, DraftHandleValue, DraftInlineStyleType, Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';

const EditorWrapper = styled.div`
  margin-top: 10px;
  border: 1px solid #ddd;
`;

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

  const handleInlineStyleToggle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, inlineStyle: DraftInlineStyleType) => {
    event.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));

    // should set state
    console.log(inlineStyle);
  }

  const handleBlockToggle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, blockStyle: DraftBlockType) => {
    event.preventDefault();
    setEditorState(RichUtils.toggleBlockType(editorState, blockStyle));

    // Should set state
    console.log(blockStyle);
  }

  const getCurrentStyle = () => {
    const selectionState = editorState.getSelection();
    const anchorKey = selectionState.getAnchorKey();
    const start = selectionState.getStartOffset();
    const end = selectionState.getEndOffset();

    const currentContent = editorState.getCurrentContent();
    const currentContentBlock = currentContent.getBlockForKey(anchorKey);

    const currentBlockType = currentContentBlock.getType() as DraftBlockType;
    const currentInlineStyles = currentContentBlock.getInlineStyleAt(start - 1).toArray() as DraftInlineStyleType[];
    const selectedText = currentContentBlock.getText().slice(start, end);

    // Should set state
    console.log(currentBlockType);
    console.log(currentInlineStyles);
    console.log(selectedText);
  };

  return (
    <div onClick={() => { editorRef?.current?.focus() }}>
      {editorEnable && (
        <>
          <div>
            <button onMouseDown={(event) => handleInlineStyleToggle(event, 'BOLD')}>Bold</button>
            <button onMouseDown={(event) => handleInlineStyleToggle(event, 'ITALIC')}>Italic</button>
            <button onMouseDown={(event) => handleInlineStyleToggle(event, 'CODE')}>Code</button>
            <button onMouseDown={(event) => handleInlineStyleToggle(event, 'STRIKETHROUGH')}>StrikeThrough</button>
            <button onMouseDown={(event) => handleInlineStyleToggle(event, 'UNDERLINE')}>UnderLine</button>
          </div>
          <div>
            <button onMouseDown={(event) => handleBlockToggle(event, 'header-one')}>h1</button>
            <button onMouseDown={(event) => handleBlockToggle(event, 'header-two')}>h2</button>
            <button onMouseDown={(event) => handleBlockToggle(event, 'header-three')}>h3</button>
            <button onMouseDown={(event) => handleBlockToggle(event, 'header-four')}>h4</button>
            <button onMouseDown={(event) => handleBlockToggle(event, 'header-five')}>h5</button>
            <button onMouseDown={(event) => handleBlockToggle(event, 'header-six')}>h6</button>
          </div>
          <div>
            <button onMouseDown={(event) => handleBlockToggle(event, 'unstyled')}>unstyled</button>
            <button onMouseDown={(event) => handleBlockToggle(event, 'paragraph')}>p</button>
            <button onMouseDown={(event) => handleBlockToggle(event, 'unordered-list-item')}>ul</button>
            <button onMouseDown={(event) => handleBlockToggle(event, 'ordered-list-item')}>ol</button>
            <button onMouseDown={(event) => handleBlockToggle(event, 'blockquote')}>blockquote</button>
            <button onMouseDown={(event) => handleBlockToggle(event, 'code-block')}>code-block</button>
            <button onMouseDown={(event) => handleBlockToggle(event, 'atomic')}>atomic</button>
          </div>

          <EditorWrapper>
            <Editor
              ref={editorRef}
              editorState={editorState}
              onChange={(state) => {
                getCurrentStyle();
                setEditorState(state);
              }}
              onFocus={getCurrentStyle}
              handleKeyCommand={handleKeyCommand}
            />
          </EditorWrapper>
        </>
      )}
    </div>
  )
}

export { App }
