import { useEffect, useRef, useState } from 'react';

// 새 창의 기본 크기(아이폰15 프로맥스)를 기준 삼아, 창을 늘리면 화면도 비례해서 커짐
export const BASE_WIDTH = 430;

export function useScaledWindow() {
  const screenRef = useRef(null);
  const [scale, setScale] = useState(() => window.innerWidth / BASE_WIDTH);
  const [naturalHeight, setNaturalHeight] = useState(0);

  useEffect(() => {
    const updateScale = () => setScale(window.innerWidth / BASE_WIDTH);
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    if (!screenRef.current) return undefined;
    const el = screenRef.current;
    const observer = new ResizeObserver(([entry]) => {
      setNaturalHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { screenRef, scale, naturalHeight };
}
