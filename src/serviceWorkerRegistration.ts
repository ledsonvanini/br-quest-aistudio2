export function registerServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    // Em ambiente de desenvolvimento, desativa Service Workers para evitar colisões de cache com Vite HMR e dual React instances
    if (import.meta.env.DEV) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.unregister();
        }
      });
      if ('caches' in window) {
        caches.keys().then((keys) => {
          for (const key of keys) {
            caches.delete(key);
          }
        });
      }
      return;
    }

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
