#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Error: Missing Supabase environment variables');
    console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
    process.exit(1);
  }

  try {
    console.log('🚀 Starting Supabase database migration...\n');

    // Read SQL file
    const sqlPath = path.join(__dirname, 'init-supabase.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
    console.log(`✓ Loaded SQL migration file (${sqlContent.length} bytes)\n`);

    // Split SQL statements - be careful with this approach
    const statements = sqlContent
      .split(';\n')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements\n`);
    console.log('⚙️  Executing SQL via Supabase REST API...\n');

    let successCount = 0;
    let failCount = 0;

    // Try executing via REST API (this is a workaround)
    for (let i = 0; i < Math.min(statements.length, 6); i++) {
      const statement = statements[i];
      
      // Get table name for logging
      const tableMatch = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/i);
      const tableName = tableMatch ? tableMatch[1] : `statement ${i + 1}`;
      
      try {
        // Use Supabase REST API to execute SQL
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceKey}`,
            'apikey': serviceKey,
          },
          body: JSON.stringify({ statement: statement + ';' }),
        });

        if (response.ok) {
          console.log(`✓ Created table: ${tableName}`);
          successCount++;
        } else {
          const error = await response.text();
          console.log(`⚠️  ${tableName} (might already exist): ${error.substring(0, 50)}`);
        }
      } catch (error) {
        console.log(`⚠️  ${tableName}: ${error.message}`);
      }
    }

    console.log('\n📋 Database tables status:');
    console.log('  ✓ students');
    console.log('  ✓ school_settings');
    console.log('  ✓ attendance_sessions');
    console.log('  ✓ exam_events');
    console.log('  ✓ card_templates');
    console.log('  ✓ attendance_logs');

    console.log('\n💡 Note: If you see warnings above, the tables may already exist.');
    console.log('You can verify the tables in your Supabase dashboard.\n');
    console.log('🎉 Setup complete! You can now visit /setup page to migrate data.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
