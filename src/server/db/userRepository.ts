import { getDatabase } from './database';

export interface UserEntity {
  id: string;
  username: string;
  display_name: string;
  email: string | null;
  password_hash: string | null;
  avatar_id: string;
  is_guest: number;
  created_at: string;
  last_login_at: string;
}

export interface UserPreferencesEntity {
  user_id: string;
  sound_enabled: boolean;
  default_map_mode: string;
  high_contrast: boolean;
  auto_rotate_globe: boolean;
  theme: string;
  updated_at: string;
}

export interface UserProgressEntity {
  user_id: string;
  xp: number;
  level: number;
  daily_streak: number;
  unlocked_insignias: string[];
  completed_states: string[];
  read_pergaments: string[];
  explored_dialogues: string[];
  updated_at: string;
}

/**
 * Repositório desacoplado para operações de usuário no SQLite.
 * Pode ser facilmente substituído por outro banco no futuro.
 */
export class SqliteUserRepository {
  public findById(id: string): UserEntity | null {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const row = stmt.get(id) as UserEntity | undefined;
    return row || null;
  }

  public findByUsername(username: string): UserEntity | null {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE username = ? COLLATE NOCASE');
    const row = stmt.get(username) as UserEntity | undefined;
    return row || null;
  }

  public create(user: Omit<UserEntity, 'created_at' | 'last_login_at'>): UserEntity {
    const db = getDatabase();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO users (id, username, display_name, email, password_hash, avatar_id, is_guest, created_at, last_login_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      user.id,
      user.username,
      user.display_name,
      user.email,
      user.password_hash,
      user.avatar_id,
      user.is_guest,
      now,
      now
    );

    // Inicializa preferências padrão
    this.savePreferences({
      user_id: user.id,
      sound_enabled: true,
      default_map_mode: '2d',
      high_contrast: false,
      auto_rotate_globe: true,
      theme: 'cartographic',
      updated_at: now,
    });

    // Inicializa progresso vazio
    this.saveProgress({
      user_id: user.id,
      xp: 0,
      level: 1,
      daily_streak: 1,
      unlocked_insignias: [],
      completed_states: [],
      read_pergaments: [],
      explored_dialogues: [],
      updated_at: now,
    });

    return {
      ...user,
      created_at: now,
      last_login_at: now,
    };
  }

  public updateLastLogin(id: string): void {
    const db = getDatabase();
    const now = new Date().toISOString();
    db.prepare('UPDATE users SET last_login_at = ? WHERE id = ?').run(now, id);
  }

  public getPreferences(userId: string): UserPreferencesEntity | null {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM user_preferences WHERE user_id = ?');
    const row = stmt.get(userId) as any;
    if (!row) return null;

    return {
      user_id: row.user_id,
      sound_enabled: Boolean(row.sound_enabled),
      default_map_mode: row.default_map_mode,
      high_contrast: Boolean(row.high_contrast),
      auto_rotate_globe: Boolean(row.auto_rotate_globe),
      theme: row.theme,
      updated_at: row.updated_at,
    };
  }

  public savePreferences(prefs: UserPreferencesEntity): void {
    const db = getDatabase();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO user_preferences (user_id, sound_enabled, default_map_mode, high_contrast, auto_rotate_globe, theme, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        sound_enabled = excluded.sound_enabled,
        default_map_mode = excluded.default_map_mode,
        high_contrast = excluded.high_contrast,
        auto_rotate_globe = excluded.auto_rotate_globe,
        theme = excluded.theme,
        updated_at = excluded.updated_at
    `);

    stmt.run(
      prefs.user_id,
      prefs.sound_enabled ? 1 : 0,
      prefs.default_map_mode || '2d',
      prefs.high_contrast ? 1 : 0,
      prefs.auto_rotate_globe ? 1 : 0,
      prefs.theme || 'cartographic',
      now
    );
  }

  public getProgress(userId: string): UserProgressEntity | null {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM user_progress WHERE user_id = ?');
    const row = stmt.get(userId) as any;
    if (!row) return null;

    return {
      user_id: row.user_id,
      xp: row.xp || 0,
      level: row.level || 1,
      daily_streak: row.daily_streak || 1,
      unlocked_insignias: JSON.parse(row.unlocked_insignias_json || '[]'),
      completed_states: JSON.parse(row.completed_states_json || '[]'),
      read_pergaments: JSON.parse(row.read_pergaments_json || '[]'),
      explored_dialogues: JSON.parse(row.explored_dialogues_json || '[]'),
      updated_at: row.updated_at,
    };
  }

  public saveProgress(progress: UserProgressEntity): void {
    const db = getDatabase();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO user_progress (user_id, xp, level, daily_streak, unlocked_insignias_json, completed_states_json, read_pergaments_json, explored_dialogues_json, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        xp = excluded.xp,
        level = excluded.level,
        daily_streak = excluded.daily_streak,
        unlocked_insignias_json = excluded.unlocked_insignias_json,
        completed_states_json = excluded.completed_states_json,
        read_pergaments_json = excluded.read_pergaments_json,
        explored_dialogues_json = excluded.explored_dialogues_json,
        updated_at = excluded.updated_at
    `);

    stmt.run(
      progress.user_id,
      progress.xp,
      progress.level,
      progress.daily_streak,
      JSON.stringify(progress.unlocked_insignias),
      JSON.stringify(progress.completed_states),
      JSON.stringify(progress.read_pergaments),
      JSON.stringify(progress.explored_dialogues),
      now
    );
  }
}

export const userRepository = new SqliteUserRepository();
