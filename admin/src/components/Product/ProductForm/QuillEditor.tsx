// src/Editor.jsx
import { useMemo, useRef, useState } from "react"
import "react-quill/dist/quill.snow.css"
import ReactQuill from "react-quill"

type HTML = string;

interface MainInfoProps {
  onChange(html: HTML): void,
  htmlProps: HTML
}

function QuillEditor({htmlProps, onChange}: MainInfoProps) {
  const quillRef = useRef()
  // quill에서 사용할 모듈
  // useMemo를 사용하여 modules가 렌더링 시 에디터가 사라지는 버그를 방지
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          ["blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }, "link", "image"],
        ],
      },
    }
  }, [])
  return (
    <div style={{ margin: "50px" }}>
      <button onClick={() => console.log(htmlProps)}>Value</button>
      <ReactQuill
        style={{ width: "600px", height: "600px" }}
        placeholder="Quill Content"
        theme="snow"
        // ref={quillRef}
        value={htmlProps}
        onChange={onChange}
        modules={modules}
      />
    </div>
  )
}
export default QuillEditor