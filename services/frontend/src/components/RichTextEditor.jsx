import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// 정렬/글자크기를 class가 아닌 inline style로 저장하도록 등록한다.
// (서버 sanitizer가 style 속성 중 text-align/font-size만 안전하게 허용하는 정책과 맞물린다)
let attributorsRegistered = false;
function registerStyleAttributors() {
  if (attributorsRegistered) return;
  const AlignStyle = Quill.import('attributors/style/align');
  const SizeStyle = Quill.import('attributors/style/size');
  SizeStyle.whitelist = ['0.75em', '1.5em', '2.5em'];
  Quill.register(AlignStyle, true);
  Quill.register(SizeStyle, true);
  attributorsRegistered = true;
}

const TOOLBAR_OPTIONS = [
  [{ align: [] }],
  [{ size: ['0.75em', false, '1.5em', '2.5em'] }],
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
];

// 커스텀 섹션 내용을 작성하는 리치 텍스트 에디터.
// value는 최초 마운트 시 한 번만 반영한다(입력 중 커서 위치가 튀는 것을 방지) —
// 값이 바뀔 때마다 다시 그려야 하는 화면에서는 key prop으로 컴포넌트를 새로 마운트시켜 쓴다.
export default function RichTextEditor({ value, onChange, placeholder }) {
  const containerRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    registerStyleAttributors();
    const quill = new Quill(containerRef.current, {
      theme: 'snow',
      placeholder,
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    if (value) quill.clipboard.dangerouslyPasteHTML(value);
    quill.on('text-change', () => {
      const html = quill.root.innerHTML;
      onChangeRef.current(html === '<p><br></p>' ? '' : html);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="rich-text-editor" ref={containerRef} />;
}
