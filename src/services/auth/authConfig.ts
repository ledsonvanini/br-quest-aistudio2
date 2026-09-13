import { IAuthAdapter } from './authTypes';
import { FirebaseAuthAdapter } from './adapters/firebaseAuthAdapter';

/**
 * Ponto Único de Injeção de Dependência de Autenticação.
 * Agora conectado diretamente ao projeto oficial Google Cloud / Firebase provisionado:
 * - Projeto: grounded-yardage-txctm
 * - Firebase Auth (Google Sign-In, Email/Senha e Convidado Anônimo)
 * - Cloud Firestore (user_preferences e user_progress)
 */
export const activeAuthAdapter: IAuthAdapter = new FirebaseAuthAdapter();
