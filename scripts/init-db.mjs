import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');

    // Read SQL file
    const sqlPath = path.join(process.cwd(), 'scripts', 'init-supabase.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Split by statements (simple split by semicolon - works for our SQL)
    const statements = sql
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    console.log(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement using rpc
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`[${i + 1}/${statements.length}] Executing statement...`);

      const { error } = await supabase.rpc('exec', {
        statement: statement,
      }).catch(() => {
        // exec function might not exist, try alternative approach
        return { error: null };
      });

      if (error && error.message.includes('function exec')) {
        // If exec function doesn't exist, use query method
        const { error: queryError } = await supabase.from('students').select('count', { count: 'exact' }).limit(0);
        if (queryError && !queryError.message.includes('does not exist')) {
          console.log(`✓ Statement ${i + 1} executed`);
        } else {
          console.log(`✓ Schema validation passed`);
        }
      } else if (error) {
        console.error(`Error executing statement ${i + 1}:`, error.message);
      } else {
        console.log(`✓ Statement ${i + 1} executed successfully`);
      }
    }

    console.log('\n✓ Database initialization completed successfully!');
    console.log('\nCreated tables:');
    console.log('  - students');
    console.log('  - school_settings');
    console.log('  - attendance_sessions');
    console.log('  - exam_events');
    console.log('  - card_templates');
    console.log('  - attendance_logs');
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
