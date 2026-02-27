-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nis VARCHAR(50) NOT NULL UNIQUE,
  nisn VARCHAR(20),
  name VARCHAR(255) NOT NULL,
  class VARCHAR(50) NOT NULL,
  major VARCHAR(255) NOT NULL,
  school_year VARCHAR(50) NOT NULL,
  photo_url TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'Aktif',
  valid_until DATE NOT NULL,
  card_code VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create school_settings table
CREATE TABLE IF NOT EXISTS public.school_settings (
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
  student_show_logo_front BOOLEAN DEFAULT true,
  student_show_logo_back BOOLEAN DEFAULT true,
  student_show_logo_right_front BOOLEAN DEFAULT true,
  student_show_logo_right_back BOOLEAN DEFAULT false,
  student_show_sig_front BOOLEAN DEFAULT false,
  student_show_sig_back BOOLEAN DEFAULT true,
  student_show_stamp_front BOOLEAN DEFAULT false,
  student_show_stamp_back BOOLEAN DEFAULT true,
  student_show_photo_front BOOLEAN DEFAULT true,
  student_show_photo_back BOOLEAN DEFAULT false,
  student_show_info_front BOOLEAN DEFAULT true,
  student_show_info_back BOOLEAN DEFAULT false,
  student_show_qr_front BOOLEAN DEFAULT false,
  student_show_qr_back BOOLEAN DEFAULT true,
  student_show_valid_front BOOLEAN DEFAULT true,
  student_show_valid_back BOOLEAN DEFAULT false,
  
  -- Exam Card Assets
  logo_left_exam TEXT,
  logo_right_exam TEXT,
  signature_exam TEXT,
  stamp_exam TEXT,
  terms_exam TEXT,
  
  -- Exam Layout Config
  exam_show_logo_front BOOLEAN DEFAULT true,
  exam_show_logo_back BOOLEAN DEFAULT true,
  exam_show_logo_right_front BOOLEAN DEFAULT true,
  exam_show_logo_right_back BOOLEAN DEFAULT false,
  exam_show_sig_front BOOLEAN DEFAULT false,
  exam_show_sig_back BOOLEAN DEFAULT true,
  exam_show_stamp_front BOOLEAN DEFAULT false,
  exam_show_stamp_back BOOLEAN DEFAULT true,
  exam_show_photo_front BOOLEAN DEFAULT true,
  exam_show_photo_back BOOLEAN DEFAULT false,
  exam_show_info_front BOOLEAN DEFAULT true,
  exam_show_info_back BOOLEAN DEFAULT false,
  exam_show_qr_front BOOLEAN DEFAULT false,
  exam_show_qr_back BOOLEAN DEFAULT true,
  exam_show_valid_front BOOLEAN DEFAULT true,
  exam_show_valid_back BOOLEAN DEFAULT false,
  
  -- ID Card Assets
  logo_left_id TEXT,
  logo_right_id TEXT,
  signature_id TEXT,
  stamp_id TEXT,
  terms_id TEXT,
  
  -- ID Layout Config
  id_show_logo_front BOOLEAN DEFAULT true,
  id_show_logo_back BOOLEAN DEFAULT true,
  id_show_logo_right_front BOOLEAN DEFAULT false,
  id_show_logo_right_back BOOLEAN DEFAULT false,
  id_show_sig_front BOOLEAN DEFAULT false,
  id_show_sig_back BOOLEAN DEFAULT true,
  id_show_stamp_front BOOLEAN DEFAULT false,
  id_show_stamp_back BOOLEAN DEFAULT true,
  id_show_photo_front BOOLEAN DEFAULT true,
  id_show_photo_back BOOLEAN DEFAULT false,
  id_show_info_front BOOLEAN DEFAULT true,
  id_show_info_back BOOLEAN DEFAULT false,
  id_show_qr_front BOOLEAN DEFAULT false,
  id_show_qr_back BOOLEAN DEFAULT true,
  id_show_valid_front BOOLEAN DEFAULT true,
  id_show_valid_back BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance_sessions table
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  start_time TIME,
  late_after TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exam_events table
CREATE TABLE IF NOT EXISTS public.exam_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  school_year VARCHAR(50) NOT NULL,
  semester VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create card_templates table
CREATE TABLE IF NOT EXISTS public.card_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  config_json JSONB NOT NULL,
  is_active BOOLEAN DEFAULT false,
  preview_color VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance_logs table
CREATE TABLE IF NOT EXISTS public.attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  card_code VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  session_id VARCHAR(50) NOT NULL,
  exam_id UUID REFERENCES public.exam_events(id) ON DELETE SET NULL,
  scanned_at TIMESTAMP WITH TIME ZONE NOT NULL,
  scanned_by_user_id VARCHAR(100),
  is_valid BOOLEAN DEFAULT true,
  reason TEXT,
  device_info TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_students_nis ON public.students(nis);
CREATE INDEX IF NOT EXISTS idx_students_card_code ON public.students(card_code);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_student_id ON public.attendance_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_date ON public.attendance_logs(date);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - allow public read, admin write
CREATE POLICY "Students are viewable by everyone" ON public.students FOR SELECT USING (true);
CREATE POLICY "Attendance logs are viewable by everyone" ON public.attendance_logs FOR SELECT USING (true);
CREATE POLICY "Exam events are viewable by everyone" ON public.exam_events FOR SELECT USING (true);
CREATE POLICY "Sessions are viewable by everyone" ON public.attendance_sessions FOR SELECT USING (true);
CREATE POLICY "Templates are viewable by everyone" ON public.card_templates FOR SELECT USING (true);
CREATE POLICY "Settings are viewable by everyone" ON public.school_settings FOR SELECT USING (true);
