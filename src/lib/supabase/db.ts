import { createClient } from './client';
import { createClient as createServerClient } from './server';
import { Student, SchoolSettings, AttendanceSession, AttendanceLog, ExamEvent, CardTemplate } from '@/app/lib/types';

/**
 * Client-side database operations
 */
export const supabaseDB = {
  // Students
  async getStudents(): Promise<Student[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('students')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async getStudent(id: string): Promise<Student | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async getStudentByCardCode(cardCode: string): Promise<Student | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('card_code', cardCode)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async addStudent(student: Omit<Student, 'id'>): Promise<Student> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('students')
      .insert([student])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteStudent(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // School Settings
  async getSchoolSettings(): Promise<SchoolSettings | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('school_settings')
      .select('*')
      .limit(1)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async upsertSchoolSettings(settings: SchoolSettings): Promise<SchoolSettings> {
    const supabase = createClient();
    const existing = await this.getSchoolSettings();
    
    if (existing) {
      const { data, error } = await supabase
        .from('school_settings')
        .update(settings)
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('school_settings')
        .insert([settings])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  // Attendance Sessions
  async getAttendanceSessions(): Promise<AttendanceSession[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('attendance_sessions')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async addAttendanceSession(session: AttendanceSession): Promise<AttendanceSession> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('attendance_sessions')
      .insert([session])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateAttendanceSession(id: string, updates: Partial<AttendanceSession>): Promise<AttendanceSession> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('attendance_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Exam Events
  async getExamEvents(): Promise<ExamEvent[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('exam_events')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async addExamEvent(exam: Omit<ExamEvent, 'id'>): Promise<ExamEvent> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('exam_events')
      .insert([exam])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateExamEvent(id: string, updates: Partial<ExamEvent>): Promise<ExamEvent> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('exam_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteExamEvent(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('exam_events')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Card Templates
  async getCardTemplates(): Promise<CardTemplate[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('card_templates')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async getCardTemplate(id: string): Promise<CardTemplate | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('card_templates')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async addCardTemplate(template: Omit<CardTemplate, 'id'>): Promise<CardTemplate> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('card_templates')
      .insert([template])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCardTemplate(id: string, updates: Partial<CardTemplate>): Promise<CardTemplate> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('card_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteCardTemplate(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('card_templates')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Attendance Logs
  async getAttendanceLogs(): Promise<AttendanceLog[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('attendance_logs')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async getAttendanceLogsByStudent(studentId: string): Promise<AttendanceLog[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('attendance_logs')
      .select('*')
      .eq('student_id', studentId);
    if (error) throw error;
    return data || [];
  },

  async getAttendanceLogsByDate(date: string): Promise<AttendanceLog[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('attendance_logs')
      .select('*')
      .eq('date', date);
    if (error) throw error;
    return data || [];
  },

  async addAttendanceLog(log: Omit<AttendanceLog, 'id'>): Promise<AttendanceLog> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('attendance_logs')
      .insert([log])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateAttendanceLog(id: string, updates: Partial<AttendanceLog>): Promise<AttendanceLog> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('attendance_logs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteAttendanceLog(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('attendance_logs')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

/**
 * Server-side database operations
 */
export const supabaseServerDB = {
  async getStudents() {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('students')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async getSchoolSettings() {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('school_settings')
      .select('*')
      .limit(1)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }
};
