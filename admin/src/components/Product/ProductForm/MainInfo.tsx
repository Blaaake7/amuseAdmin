import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, convertFromHTML, ContentState, AtomicBlockUtils  } from 'draft-js';
import draftjsToHtml from "draftjs-to-html";
import { useEffect, useState } from 'react';
import styles from './MainInfo.module.css';

type HTML = string;

interface MainInfoProps {
  onChange(html: HTML): void,
  htmlProps: HTML
}

function MainInfo({htmlProps, onChange}: MainInfoProps) {

  const [mainInfoState, setMainInfoState] = useState<EditorState>(EditorState.createEmpty());
  const [draftState, setDraftState] = useState<EditorState>(EditorState.createEmpty())

  useEffect(() => {
    const contentBlock = convertFromHTML(htmlProps);
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    const initialEditorState = EditorState.createWithContent(contentState);
    setMainInfoState(initialEditorState); 
    setDraftState(initialEditorState);
  }, [htmlProps])

  const updateMainInfoState = (mainInfoState: EditorState) => {
    setDraftState(mainInfoState);
  }

  useEffect(() => {
    // htmlProps가 변경될 때만 업데이트
    const contentBlock = convertFromHTML(htmlProps);
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );
    const initialEditorState = EditorState.createWithContent(contentState);
    setMainInfoState(initialEditorState);
    setDraftState(initialEditorState);
  }, [htmlProps]);

  const saveContent = () => {
    // const html = draftjsToHtml(convertToRaw(draftState.getCurrentContent()));
    // onChange(html);
    // console.log(html);
    // alert('상품 소개 글이 저장되었습니다.');

        // EditorState 복제
        const previousEditorState = EditorState.createWithContent(
          draftState.getCurrentContent()
        );
    
        // EditorState를 이전 상태로 복원
        setMainInfoState(previousEditorState);
    
        const html = draftjsToHtml(convertToRaw(draftState.getCurrentContent()));
        console.log(html);
        onChange(html);
        alert('상품 소개 글이 저장되었습니다.');
  }


  const uploadImageCallBack = (file: File) => {
    
    const contentState = draftState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'IMAGE',
      'IMMUTABLE',
      { src: URL.createObjectURL(file) }
    );

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      draftState,
      { currentContent: contentStateWithEntity },
    );
    
    return new Promise(
      (resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const src = reader.result;
          resolve({data: {link:src}});
        };
        reader.onerror = error => {
          reject(error);
        };
        reader.readAsDataURL(file);
      }
    );
  };
  

  return (
    <div className={`${styles.container} ${styles.mainInfo}`}>
      <div>
        <Editor
          editorState={draftState}
          onEditorStateChange={updateMainInfoState}
          editorStyle={{
            height: "400px",
            width: "100%",
            backgroundColor: "white",
            border: "1px solid black",
            borderRadius: "0px",
            padding: "10px",
            position:"relative",
            zIndex:0,
          }}
          toolbarStyle={{
            borderRadius: "10px"
          }}
          placeholder='내용을 입력하세요.'
          toolbar={{
            fontSize: {
              options: [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48],
            },
            image: {
              uploadCallback: uploadImageCallBack,
              alt:{present: true, mandatory: false},
              defaultSize: { height: 'auto', width: 'auto' }
            },
          }
        }        
        />
      </div>
      <button className={styles.saveBtn} onClick={saveContent}>저장</button>
    </div>
  );
}

export default MainInfo;