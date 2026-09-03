import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseTypewriterOptions {
  text: string;
  speedMs?: number;
  isActive?: boolean;
  onCharacterTyped?: () => void;
  onComplete?: () => void;
}

/**
 * Hook reutilizável para efeito clássico de digitação (Typewriter) estilo RPG.
 * Permite pular instantaneamente para o texto final ou avançar progressivamente.
 */
export function useTypewriter({
  text,
  speedMs = 28,
  isActive = true,
  onCharacterTyped,
  onComplete,
}: UseTypewriterOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Limpa o timer ativo
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Pula imediatamente para o final do texto
  const skipToEnd = useCallback(() => {
    clearTimer();
    setDisplayedText(text);
    setIsTyping(false);
    indexRef.current = text.length;
    onComplete?.();
  }, [text, clearTimer, onComplete]);

  useEffect(() => {
    if (!isActive) {
      setDisplayedText('');
      setIsTyping(false);
      clearTimer();
      return;
    }

    // Reinicia ao mudar o texto
    clearTimer();
    setDisplayedText('');
    indexRef.current = 0;
    setIsTyping(true);

    if (!text) {
      setIsTyping(false);
      return;
    }

    timerRef.current = setInterval(() => {
      indexRef.current++;
      const currentSlice = text.slice(0, indexRef.current);
      setDisplayedText(currentSlice);
      onCharacterTyped?.();

      if (indexRef.current >= text.length) {
        clearTimer();
        setIsTyping(false);
        onComplete?.();
      }
    }, speedMs);

    return () => clearTimer();
  }, [text, speedMs, isActive, clearTimer, onCharacterTyped, onComplete]);

  return {
    displayedText,
    isTyping,
    skipToEnd,
    isComplete: !isTyping && displayedText.length === text.length,
  };
}
