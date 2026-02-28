import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    // Create students table
    await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS students (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nis VARCHAR(20) NOT NULL UNIQUE,
          nisn VARCHAR(20) UNIQUE,
          name VARCHAR(255) NOT NULL,
          class VARCHAR(50) NOT NULL,
          major VARCHAR(255) NOT NULL,
          school_year VARCHAR(20) NOT NULL,
          photo_url TEXT,
          status VARCHAR(50) NOT NULL DEFAULT 'Aktif',
          valid_until DATE NOT NULL,
          card_code VARCHAR(50) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    // Create school_settings table
    await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS school_settings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          school_name VARCHAR(255) NOT NULL,
          address TEXT NOT NULL,
          principal_name VARCHAR(255) NOT NULL,
          principal_nip VARCHAR(50),
          logo_left TEXT,
          logo_right TEXT,
          signature_image TEXT,
          stamp_image TEXT,
          terms_student TEXT,
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
          logo_left_exam TEXT,
          logo_right_exam TEXT,
          signature_exam TEXT,
          stamp_exam TEXT,
          terms_exam TEXT,
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
          logo_left_id TEXT,
          logo_right_id TEXT,
          signature_id TEXT,
          stamp_id TEXT,
          terms_id TEXT,
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
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    // Create attendance_sessions table
    await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS attendance_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100) NOT NULL,
          start_time TIME,
          late_after TIME,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    // Create exam_events table
    await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS exam_events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          school_year VARCHAR(20) NOT NULL,
          semester VARCHAR(50) NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    // Create card_templates table
    await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS card_templates (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          type VARCHAR(50) NOT NULL CHECK (type IN ('STUDENT_CARD', 'EXAM_CARD', 'ID_CARD')),
          name VARCHAR(255) NOT NULL,
          config_json JSONB NOT NULL DEFAULT '{}',
          is_active BOOLEAN DEFAULT true,
          preview_color VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    // Create attendance_logs table
    await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS attendance_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
          card_code VARCHAR(50) NOT NULL,
          date DATE NOT NULL,
          session_id UUID REFERENCES attendance_sessions(id),
          exam_id UUID REFERENCES exam_events(id),
          scanned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          scanned_by_user_id VARCHAR(100),
          is_valid BOOLEAN DEFAULT true,
          reason TEXT,
          device_info TEXT,
          location TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Database tables created successfully'
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
