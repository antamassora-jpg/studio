#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('🚀 Starting Supabase database migration...\n');

    const sqlFile = path.join(__dirname, 'init-supabase.sql');
    
    if (!fs.existsSync(sqlFile)) {
      throw new Error(`SQL file not found: ${sqlFile}`);
    }

    const sqlContent = fs.readFileSync(sqlFile, 'utf-8');
    console.log(`✓ Loaded SQL migration file (${sqlContent.length} bytes)\n`);

    // Try to execute using psql if available
    const dbUrl = process.env.POSTGRES_URL;
    if (!dbUrl) {
      console.error('❌ Error: POSTGRES_URL environment variable not found');
      console.log('\nYou need to set the POSTGRES_URL environment variable.');
      console.log('This is typically set automatically when Supabase is connected in v0.\n');
      process.exit(1);
    }

    console.log('📊 Executing SQL statements...\n');

    try {
      const { stdout } = await execAsync(`psql "${dbUrl}" < "${sqlFile}"`, {
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      });
      
      console.log(stdout);
      console.log('\n✅ Database migration completed successfully!');
      console.log('\n📋 Created tables:');
      console.log('  ✓ students');
      console.log('  ✓ school_settings');
      console.log('  ✓ attendance_sessions');
      console.log('  ✓ exam_events');
      console.log('  ✓ card_templates');
      console.log('  ✓ attendance_logs\n');
      console.log('🎉 Your Supabase database is ready to use!');
      
    } catch (error) {
      // If psql is not available, show instructions
      if (error.message.includes('psql: command not found')) {
        console.log('⚠️  psql command not found. Using alternative method...\n');
        console.log('Please execute the SQL manually in your Supabase dashboard:\n');
        console.log('1. Go to https://app.supabase.com');
        console.log('2. Open your project');
        console.log('3. Navigate to SQL Editor');
        console.log('4. Create a new query and paste the contents of scripts/init-supabase.sql');
        console.log('5. Click "Run"\n');
        console.log('Or you can use the /setup page in the app for a guided migration.\n');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
}

runMigration();
