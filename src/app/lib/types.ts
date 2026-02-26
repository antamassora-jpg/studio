export type StudentStatus = 'Aktif' | 'Nonaktif' | 'Lulus' | 'Pindah';

export interface Student {
  id: string;
  nis: string;
  nisn?: string;
  name: string;
  class: string;
  major: string;
  school_year: string;
  photo_url?: string;
  status: StudentStatus;
  valid_until: string;
  card_code: string;
}

export interface SchoolSettings {
  school_name: string;
  address: string;
  principal_name: string;
  principal_nip?: string;
  
  // Student Card Assets (Default)
  logo_left: string;
  logo_right: string;
  signature_image: string;
  stamp_image: string;
  terms_student: string;

  // Exam Card Assets
  logo_left_exam: string;
  logo_right_exam: string;
  signature_exam: string;
  stamp_exam: string;
  terms_exam: string;

  // ID Card Assets
  logo_left_id: string;
  logo_right_id: string;
  signature_id: string;
  stamp_id: string;
  terms_id: string;
}

export type TemplateType = 'STUDENT_CARD' | 'EXAM_CARD' | 'ID_CARD';

export interface CardTemplate {
  id: string;
  type: TemplateType;
  name: string;
  config_json: string;
  is_active: boolean;
  preview_color: string;
}

export interface ExamEvent {
  id: string;
  name: string;
  school_year: string;
  semester: string;
  start_date: string;
  end_date: string;
  notes?: string;
}

export interface AttendanceSession {
  id: string;
  name: string;
  start_time?: string;
  late_after?: string;
}

export interface AttendanceLog {
  id: string;
  student_id: string;
  card_code: string;
  date: string;
  session_id: string;
  scanned_at: string;
  scanned_by_user_id: string;
  is_valid: boolean;
  reason?: string;
  device_info?: string;
  location?: string;
}
