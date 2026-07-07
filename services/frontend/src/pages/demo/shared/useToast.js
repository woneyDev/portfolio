import { useRef, useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState('');
  const timerRef = useRef(null);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setToast(''), 1800);
  };

  return { toast, showToast };
}
