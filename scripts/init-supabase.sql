-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nis VARCHAR(50) NOT NULL UNIQUE,
  nisn VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  class VARCHAR(50) NOT NULL,
  major VARCHAR(255) NOT NULL,
  school_year VARCHAR(20) NOT NULL,
  photo_url TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'Aktif',
  valid_until DATE NOT NULL,
  card_code VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create school_settings table
CREATE TABLE IF NOT EXISTS school_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  principal_name VARCHAR(255) NOT NULL,
  principal_nip VARCHAR(50),
  
  -- Student Card Assets
  logo_left TEXT,
  logo_right TEXT,
  signature_image TEXT,
  stamp_image TEXT,
  terms_student TEXT,
  
  -- Student Layout Config
  student_show_logo_front BOOLEAN DEFAULT TRUE,
  student_show_logo_back BOOLEAN DEFAULT TRUE,
  student_show_logo_right_front BOOLEAN DEFAULT TRUE,
  student_show_logo_right_back BOOLEAN DEFAULT FALSE,
  student_show_sig_front BOOLEAN DEFAULT FALSE,
  student_show_sig_back BOOLEAN DEFAULT TRUE,
  student_show_stamp_front BOOLEAN DEFAULT FALSE,
  student_show_stamp_back BOOLEAN DEFAULT TRUE,
  student_show_photo_front BOOLEAN DEFAULT TRUE,
  student_show_photo_back BOOLEAN DEFAULT FALSE,
  student_show_info_front BOOLEAN DEFAULT TRUE,
  student_show_info_back BOOLEAN DEFAULT FALSE,
  student_show_qr_front BOOLEAN DEFAULT FALSE,
  student_show_qr_back BOOLEAN DEFAULT TRUE,
  student_show_valid_front BOOLEAN DEFAULT TRUE,
  student_show_valid_back BOOLEAN DEFAULT FALSE,
  
  -- Exam Card Assets
  logo_left_exam TEXT,
  logo_right_exam TEXT,
  signature_exam TEXT,
  stamp_exam TEXT,
  terms_exam TEXT,
  
  -- Exam Layout Config
  exam_show_logo_front BOOLEAN DEFAULT TRUE,
  exam_show_logo_back BOOLEAN DEFAULT TRUE,
  exam_show_logo_right_front BOOLEAN DEFAULT TRUE,
  exam_show_logo_right_back BOOLEAN DEFAULT FALSE,
  exam_show_sig_front BOOLEAN DEFAULT FALSE,
  exam_show_sig_back BOOLEAN DEFAULT TRUE,
  exam_show_stamp_front BOOLEAN DEFAULT FALSE,
  exam_show_stamp_back BOOLEAN DEFAULT TRUE,
  exam_show_photo_front BOOLEAN DEFAULT TRUE,
  exam_show_photo_back BOOLEAN DEFAULT FALSE,
  exam_show_info_front BOOLEAN DEFAULT TRUE,
  exam_show_info_back BOOLEAN DEFAULT FALSE,
  exam_show_qr_front BOOLEAN DEFAULT FALSE,
  exam_show_qr_back BOOLEAN DEFAULT TRUE,
  exam_show_valid_front BOOLEAN DEFAULT TRUE,
  exam_show_valid_back BOOLEAN DEFAULT FALSE,
  
  -- ID Card Assets
  logo_left_id TEXT,
  logo_right_id TEXT,
  signature_id TEXT,
  stamp_id TEXT,
  terms_id TEXT,
  
  -- ID Layout Config
  id_show_logo_front BOOLEAN DEFAULT TRUE,
  id_show_logo_back BOOLEAN DEFAULT TRUE,
  id_show_logo_right_front BOOLEAN DEFAULT FALSE,
  id_show_logo_right_back BOOLEAN DEFAULT FALSE,
  id_show_sig_front BOOLEAN DEFAULT FALSE,
  id_show_sig_back BOOLEAN DEFAULT TRUE,
  id_show_stamp_front BOOLEAN DEFAULT FALSE,
  id_show_stamp_back BOOLEAN DEFAULT TRUE,
  id_show_photo_front BOOLEAN DEFAULT TRUE,
  id_show_photo_back BOOLEAN DEFAULT FALSE,
  id_show_info_front BOOLEAN DEFAULT TRUE,
  id_show_info_back BOOLEAN DEFAULT FALSE,
  id_show_qr_front BOOLEAN DEFAULT FALSE,
  id_show_qr_back BOOLEAN DEFAULT TRUE,
  id_show_valid_front BOOLEAN DEFAULT TRUE,
  id_show_valid_back BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create attendance_sessions table
CREATE TABLE IF NOT EXISTS attendance_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  start_time VARCHAR(10),
  late_after VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create exam_events table
CREATE TABLE IF NOT EXISTS exam_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  school_year VARCHAR(20) NOT NULL,
  semester VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create card_templates table
CREATE TABLE IF NOT EXISTS card_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  config_json JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT FALSE,
  preview_color VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create attendance_logs table
CREATE TABLE IF NOT EXISTS attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  card_code VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  session_id UUID REFERENCES attendance_sessions(id) ON DELETE SET NULL,
  exam_id UUID REFERENCES exam_events(id) ON DELETE SET NULL,
  scanned_at TIMESTAMP WITH TIME ZONE NOT NULL,
  scanned_by_user_id UUID,
  is_valid BOOLEAN DEFAULT TRUE,
  reason TEXT,
  device_info TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_students_nis ON students(nis);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_attendance_logs_student_id ON attendance_logs(student_id);
CREATE INDEX idx_attendance_logs_date ON attendance_logs(date);
CREATE INDEX idx_attendance_logs_session_id ON attendance_logs(session_id);

-- Enable real-time (replication)
ALTER PUBLICATION supabase_realtime ADD TABLE students;
ALTER PUBLICATION supabase_realtime ADD TABLE school_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE attendance_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE exam_events;
ALTER PUBLICATION supabase_realtime ADD TABLE card_templates;
ALTER PUBLICATION supabase_realtime ADD TABLE attendance_logs;
