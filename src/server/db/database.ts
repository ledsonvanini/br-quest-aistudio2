import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

let dbInstance: DatabaseSync | null = null;

/**
 * Obtém a instância singleton do SQLite leve para o BR Quest.
 * Armazena dados de usuários, preferências e progresso gamificado.
 */
export function getDatabase(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  // Cria pasta data/ se não existir
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'br_quest.db');
  dbInstance = new DatabaseSync(dbPath);

  // Inicializar esquema do banco
  initSchema(dbInstance);

  return dbInstance;
}

function initSchema(db: DatabaseSync): void {
  // 1. Tabela de Usuários (Básica e Leve)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      email TEXT,
      password_hash TEXT,
      avatar_id TEXT DEFAULT 'recruta',
      is_guest INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      last_login_at TEXT NOT NULL
    );
  `);

  // 2. Tabela de Preferências do Usuário
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      user_id TEXT PRIMARY KEY,
      sound_enabled INTEGER DEFAULT 1,
      default_map_mode TEXT DEFAULT '2d',
      high_contrast INTEGER DEFAULT 0,
      auto_rotate_globe INTEGER DEFAULT 1,
      theme TEXT DEFAULT 'cartographic',
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 3. Tabela de Progresso Gamificado do Usuário
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_progress (
      user_id TEXT PRIMARY KEY,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      daily_streak INTEGER DEFAULT 1,
      unlocked_insignias_json TEXT DEFAULT '[]',
      completed_states_json TEXT DEFAULT '[]',
      read_pergaments_json TEXT DEFAULT '[]',
      explored_dialogues_json TEXT DEFAULT '[]',
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}
