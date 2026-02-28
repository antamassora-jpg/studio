import { createClient } from './client';
import type { Student, SchoolSettings, AttendanceSession, ExamEvent, CardTemplate } from '@/app/lib/types';

const STORAGE_KEY = 'educard_sync_db';

interface DB {
  students: Student[];
  school_settings: SchoolSettings;
  sessions: AttendanceSession[];
  logs: any[];
  exams: ExamEvent[];
  templates: CardTemplate[];
}

/**
 * Migrates data from localStorage to Supabase
 * Call this once when initializing the app
 */
export async function migrateLocalStorageToSupabase(): Promise<boolean> {
  try {
    if (typeof window === 'undefined') return false;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      console.log('[Migration] No localStorage data to migrate');
      return true;
    }

    const db: DB = JSON.parse(stored);
    const supabase = createClient();
    let migrationCount = 0;

    console.log('[Migration] Starting migration from localStorage to Supabase');

    // Migrate school settings
    if (db.school_settings) {
      const { error } = await supabase
        .from('school_settings')
        .upsert([db.school_settings], { onConflict: 'id' });

      if (error) {
        console.error('[Migration] Error migrating school settings:', error);
      } else {
        console.log('[Migration] School settings migrated');
        migrationCount++;
      }
    }

    // Migrate students
    if (db.students && db.students.length > 0) {
      const { error } = await supabase
        .from('students')
        .upsert(db.students, { onConflict: 'id' });

      if (error) {
        console.error('[Migration] Error migrating students:', error);
      } else {
        console.log(`[Migration] ${db.students.length} students migrated`);
        migrationCount++;
      }
    }

    // Migrate attendance sessions
    if (db.sessions && db.sessions.length > 0) {
      const { error } = await supabase
        .from('attendance_sessions')
        .upsert(db.sessions, { onConflict: 'id' });

      if (error) {
        console.error('[Migration] Error migrating sessions:', error);
      } else {
        console.log(`[Migration] ${db.sessions.length} sessions migrated`);
        migrationCount++;
      }
    }

    // Migrate exam events
    if (db.exams && db.exams.length > 0) {
      const { error } = await supabase
        .from('exam_events')
        .upsert(db.exams, { onConflict: 'id' });

      if (error) {
        console.error('[Migration] Error migrating exams:', error);
      } else {
        console.log(`[Migration] ${db.exams.length} exams migrated`);
        migrationCount++;
      }
    }

    // Migrate card templates
    if (db.templates && db.templates.length > 0) {
      const { error } = await supabase
        .from('card_templates')
        .upsert(db.templates, { onConflict: 'id' });

      if (error) {
        console.error('[Migration] Error migrating templates:', error);
      } else {
        console.log(`[Migration] ${db.templates.length} templates migrated`);
        migrationCount++;
      }
    }

    // Migrate attendance logs
    if (db.logs && db.logs.length > 0) {
      const { error } = await supabase
        .from('attendance_logs')
        .insert(db.logs);

      if (error) {
        console.error('[Migration] Error migrating logs:', error);
      } else {
        console.log(`[Migration] ${db.logs.length} logs migrated`);
        migrationCount++;
      }
    }

    console.log(`[Migration] Successfully migrated ${migrationCount} data types`);
    
    // Mark migration as complete
    localStorage.setItem('supabase_migrated', 'true');
    
    return true;
  } catch (error) {
    console.error('[Migration] Error during migration:', error);
    return false;
  }
}

/**
 * Check if migration has already been completed
 */
export function isMigrationComplete(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('supabase_migrated') === 'true';
}
