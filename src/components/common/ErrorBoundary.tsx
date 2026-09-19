import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught application error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="container-error-boundary flex min-h-screen w-full flex-col items-center justify-center bg-[#020617] px-4 text-slate-100">
          <div className="card-error-boundary w-full max-w-md rounded-2xl border border-rose-500/30 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-2xl text-rose-400">
              ⚠️
            </div>
            <h2 className="mb-2 text-xl font-bold tracking-tight text-white">
              Algo inesperado aconteceu
            </h2>
            <p className="mb-6 text-sm text-slate-400 leading-relaxed">
              Ocorreu uma falha ao renderizar os componentes visuais. Você pode tentar recarregar o mapa e a interface.
            </p>
            {this.state.error && (
              <pre className="mb-6 max-h-32 overflow-auto rounded-lg bg-black/50 p-3 text-left font-mono text-xs text-rose-300">
                {this.state.error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={this.handleReload}
              className="btn-recarregar-app w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg transition hover:brightness-110 active:scale-[0.98]"
            >
              Recarregar Aplicação
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
