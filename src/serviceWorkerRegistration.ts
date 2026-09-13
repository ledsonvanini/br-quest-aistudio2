export function registerServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[BR Quest PWA] Service Worker registrado com escopo:', registration.scope);
        })
        .catch((error) => {
          console.warn('[BR Quest PWA] Erro ao registrar Service Worker:', error);
        });
    });
  }
}
