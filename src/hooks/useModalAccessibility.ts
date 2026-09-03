import { useEffect, useRef } from 'react';

export interface UseModalAccessibilityOptions {
  isOpen: boolean;
  onClose: () => void;
  closeOnEsc?: boolean;
  lockScroll?: boolean;
}

/**
 * Hook reutilizável de acessibilidade e comportamento padrão para janelas modais.
 * - Gerencia fechamento via tecla Escape (ESC).
 * - Bloqueia rolagem do body enquanto o modal estiver aberto (restaura ao fechar).
 * - Foca automaticamente no container do modal ao abrir.
 */
export function useModalAccessibility({
  isOpen,
  onClose,
  closeOnEsc = true,
  lockScroll = true,
}: UseModalAccessibilityOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 1. Tratamento da tecla ESC
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  // 2. Bloqueio de rolagem do body
  useEffect(() => {
    if (!isOpen || !lockScroll) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, lockScroll]);

  // 3. Foco inicial no modal para navegação via teclado
  useEffect(() => {
    if (isOpen && containerRef.current) {
      containerRef.current.focus?.();
    }
  }, [isOpen]);

  return { containerRef };
}
