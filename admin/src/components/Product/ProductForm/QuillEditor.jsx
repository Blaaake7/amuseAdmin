// src/Editor.jsx
import { useEffect, useMemo, useRef, useState } from "react"
import "react-quill/dist/quill.snow.css"
import ReactQuill, { Quill } from "react-quill"
// import ImageResize from 'quill-image-resize-module-react'
import {storage} from "../../../firebase";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { ImageActions } from '@xeger/quill-image-actions';
import { ImageFormats } from '@xeger/quill-image-formats';

// type HTML = string;

// interface MainInfoProps {
//   onChange(html: HTML): void,
//   htmlProps: HTML
// }

Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);

function QuillEditor({htmlProps, onChange}) {

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'align',
    'color',
    'background',
    'float',
    'height',
    'width'
  ];

  const quillRef = useRef();
  // quill에서 사용할 모듈
  // useMemo를 사용하여 modules가 렌더링 시 에디터가 사라지는 버그를 방지

  const imageHandler = () => {

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.addEventListener("change", async () => {

      const editor = quillRef.current.getEditor();
      const file = input.files[0];
      const range = editor.getSelection(true);

      try {
        // 파일명을 "image/Date.now()"로 저장
        const storageRef = ref(
          storage,
          `image/${Date.now()}`
        );
        // Firebase Method : uploadBytes, getDownloadURL
        await uploadBytes(storageRef, file).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            // 이미지 URL 에디터에 삽입
            editor.insertEmbed(range.index, "image", url);
            // URL 삽입 후 커서를 이미지 뒷 칸으로 이동
            editor.setSelection(range.index + 1);
          });
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  const modules = useMemo(() => {
    return {
      imageActions: {},
      imageFormats: {},
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          [{ size: ['small', "regular", "large", "huge"] }], // 글꼴 크기 드롭다운 추가
          ["bold", "italic", "underline", "strike"],
          ["blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }, "link", "image"],
        ],
        handlers: {
          // 이미지 처리는 우리가 직접 imageHandler라는 함수로 처리할 것이다.
          image: imageHandler,
        },
      },
    }
  }, [])

  return (
    <div style={{ margin: "50px" }}>
      <button onClick={() => console.log(htmlProps)}>Value</button>
      <ReactQuill
        style={{ width: "1300px", height: "600px" }}
        formats={formats}
        placeholder="Quill Content"
        theme="snow"
        ref={quillRef}
        value={htmlProps}
        onChange={onChange}
        modules={modules}
        preserveWhitespace={true}
      />
    </div>
  )
}
export default QuillEditor