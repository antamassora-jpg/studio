import { createClient } from './client';
import type { Student, SchoolSettings, AttendanceSession, AttendanceLog, ExamEvent, CardTemplate } from '@/app/lib/types';

const supabase = createClient();

// ============ STUDENTS ============
export async function getStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching students:', error);
    return [];
  }

  return data?.map(row => ({
    id: row.id,
    nis: row.nis,
    nisn: row.nisn,
    name: row.name,
    class: row.class,
    major: row.major,
    school_year: row.school_year,
    photo_url: row.photo_url,
    status: row.status,
    valid_until: row.valid_until,
    card_code: row.card_code,
  })) || [];
}

export async function getStudentById(id: string): Promise<Student | null> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching student:', error);
    return null;
  }

  return data ? {
    id: data.id,
    nis: data.nis,
    nisn: data.nisn,
    name: data.name,
    class: data.class,
    major: data.major,
    school_year: data.school_year,
    photo_url: data.photo_url,
    status: data.status,
    valid_until: data.valid_until,
    card_code: data.card_code,
  } : null;
}

export async function addStudent(student: Omit<Student, 'id'>): Promise<Student | null> {
  const { data, error } = await supabase
    .from('students')
    .insert([{
      nis: student.nis,
      nisn: student.nisn,
      name: student.name,
      class: student.class,
      major: student.major,
      school_year: student.school_year,
      photo_url: student.photo_url,
      status: student.status,
      valid_until: student.valid_until,
      card_code: student.card_code,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding student:', error);
    return null;
  }

  return data ? {
    id: data.id,
    nis: data.nis,
    nisn: data.nisn,
    name: data.name,
    class: data.class,
    major: data.major,
    school_year: data.school_year,
    photo_url: data.photo_url,
    status: data.status,
    valid_until: data.valid_until,
    card_code: data.card_code,
  } : null;
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<Student | null> {
  const { data, error } = await supabase
    .from('students')
    .update({
      ...(updates.nis && { nis: updates.nis }),
      ...(updates.nisn && { nisn: updates.nisn }),
      ...(updates.name && { name: updates.name }),
      ...(updates.class && { class: updates.class }),
      ...(updates.major && { major: updates.major }),
      ...(updates.school_year && { school_year: updates.school_year }),
      ...(updates.photo_url !== undefined && { photo_url: updates.photo_url }),
      ...(updates.status && { status: updates.status }),
      ...(updates.valid_until && { valid_until: updates.valid_until }),
      ...(updates.card_code && { card_code: updates.card_code }),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating student:', error);
    return null;
  }

  return data ? {
    id: data.id,
    nis: data.nis,
    nisn: data.nisn,
    name: data.name,
    class: data.class,
    major: data.major,
    school_year: data.school_year,
    photo_url: data.photo_url,
    status: data.status,
    valid_until: data.valid_until,
    card_code: data.card_code,
  } : null;
}

export async function deleteStudent(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting student:', error);
    return false;
  }

  return true;
}

// ============ SCHOOL SETTINGS ============
export async function getSchoolSettings(): Promise<SchoolSettings | null> {
  const { data, error } = await supabase
    .from('school_settings')
    .select('*')
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching school settings:', error);
  }

  return data || null;
}

export async function updateSchoolSettings(settings: Partial<SchoolSettings>): Promise<SchoolSettings | null> {
  const existing = await getSchoolSettings();
  
  if (!existing) {
    // Create new settings
    const { data, error } = await supabase
      .from('school_settings')
      .insert([settings])
      .select()
      .single();

    if (error) {
      console.error('Error creating school settings:', error);
      return null;
    }

    return data || null;
  }

  // Update existing
  const { data, error } = await supabase
    .from('school_settings')
    .update(settings)
    .eq('id', existing.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating school settings:', error);
    return null;
  }

  return data || null;
}

// ============ ATTENDANCE SESSIONS ============
export async function getAttendanceSessions(): Promise<AttendanceSession[]> {
  const { data, error } = await supabase
    .from('attendance_sessions')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }

  return data?.map(row => ({
    id: row.id,
    name: row.name,
    start_time: row.start_time,
    late_after: row.late_after,
  })) || [];
}

export async function addAttendanceSession(session: Omit<AttendanceSession, 'id'>): Promise<AttendanceSession | null> {
  const { data, error } = await supabase
    .from('attendance_sessions')
    .insert([session])
    .select()
    .single();

  if (error) {
    console.error('Error adding session:', error);
    return null;
  }

  return data ? {
    id: data.id,
    name: data.name,
    start_time: data.start_time,
    late_after: data.late_after,
  } : null;
}

export async function updateAttendanceSession(id: string, updates: Partial<AttendanceSession>): Promise<AttendanceSession | null> {
  const { data, error } = await supabase
    .from('attendance_sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating session:', error);
    return null;
  }

  return data || null;
}

// ============ EXAM EVENTS ============
export async function getExamEvents(): Promise<ExamEvent[]> {
  const { data, error } = await supabase
    .from('exam_events')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching exams:', error);
    return [];
  }

  return data?.map(row => ({
    id: row.id,
    name: row.name,
    school_year: row.school_year,
    semester: row.semester,
    start_date: row.start_date,
    end_date: row.end_date,
    notes: row.notes,
  })) || [];
}

export async function addExamEvent(exam: Omit<ExamEvent, 'id'>): Promise<ExamEvent | null> {
  const { data, error } = await supabase
    .from('exam_events')
    .insert([exam])
    .select()
    .single();

  if (error) {
    console.error('Error adding exam:', error);
    return null;
  }

  return data || null;
}

// ============ ATTENDANCE LOGS ============
export async function getAttendanceLogs(): Promise<AttendanceLog[]> {
  const { data, error } = await supabase
    .from('attendance_logs')
    .select('*')
    .order('scanned_at', { ascending: false });

  if (error) {
    console.error('Error fetching logs:', error);
    return [];
  }

  return data?.map(row => ({
    id: row.id,
    student_id: row.student_id,
    card_code: row.card_code,
    date: row.date,
    session_id: row.session_id,
    exam_id: row.exam_id,
    scanned_at: row.scanned_at,
    scanned_by_user_id: row.scanned_by_user_id,
    is_valid: row.is_valid,
    reason: row.reason,
    device_info: row.device_info,
    location: row.location,
  })) || [];
}

export async function addAttendanceLog(log: Omit<AttendanceLog, 'id'>): Promise<AttendanceLog | null> {
  const { data, error } = await supabase
    .from('attendance_logs')
    .insert([log])
    .select()
    .single();

  if (error) {
    console.error('Error adding log:', error);
    return null;
  }

  return data || null;
}

// ============ CARD TEMPLATES ============
export async function getCardTemplates(): Promise<CardTemplate[]> {
  const { data, error } = await supabase
    .from('card_templates')
    .select('*');

  if (error) {
    console.error('Error fetching templates:', error);
    return [];
  }

  return data?.map(row => ({
    id: row.id,
    type: row.type,
    name: row.name,
    config_json: typeof row.config_json === 'string' ? row.config_json : JSON.stringify(row.config_json),
    is_active: row.is_active,
    preview_color: row.preview_color,
  })) || [];
}

export async function updateCardTemplate(id: string, updates: Partial<CardTemplate>): Promise<CardTemplate | null> {
  const { data, error } = await supabase
    .from('card_templates')
    .update({
      ...(updates.name && { name: updates.name }),
      ...(updates.config_json && { config_json: updates.config_json }),
      ...(updates.is_active !== undefined && { is_active: updates.is_active }),
      ...(updates.preview_color && { preview_color: updates.preview_color }),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating template:', error);
    return null;
  }

  return data || null;
}
