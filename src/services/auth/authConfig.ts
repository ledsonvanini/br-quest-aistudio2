import { IAuthAdapter } from './authTypes';
import { LocalSqliteAuthAdapter } from './adapters/localSqliteAuthAdapter';

/**
 * Ponto Único de Injeção de Dependência de Autenticação.
 * Para trocar de provedor (ex: Firebase, Supabase, OAuth), basta substituir
 * a instância de activeAuthAdapter aqui. Nenhum componente da UI precisará
 * ser alterado.
 */
export const activeAuthAdapter: IAuthAdapter = new LocalSqliteAuthAdapter();
