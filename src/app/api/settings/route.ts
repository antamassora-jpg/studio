import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('school_settings')
      .select('*')
      .limit(1);

    if (error) throw error;
    return NextResponse.json(data[0] || null);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    
    // Get existing settings
    const { data: existing, error: fetchError } = await supabase
      .from('school_settings')
      .select('id')
      .limit(1);

    if (fetchError) throw fetchError;

    if (existing && existing.length > 0) {
      // Update existing
      const { data, error } = await supabase
        .from('school_settings')
        .update(body)
        .eq('id', existing[0].id)
        .select();

      if (error) throw error;
      return NextResponse.json(data[0]);
    } else {
      // Create new
      const { data, error } = await supabase
        .from('school_settings')
        .insert([body])
        .select();

      if (error) throw error;
      return NextResponse.json(data[0]);
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
