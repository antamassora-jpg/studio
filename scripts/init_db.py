#!/usr/bin/env python3
import os
import psycopg2
from psycopg2 import sql
import sys

# Get database URL from environment
db_url = os.getenv('POSTGRES_URL')
if not db_url:
    print("❌ Error: POSTGRES_URL environment variable not found")
    print("\nYou need to set the POSTGRES_URL environment variable.")
    print("This is typically set automatically when Supabase is connected in v0.\n")
    sys.exit(1)

try:
    print("🚀 Starting Supabase database migration...\n")
    
    # Read SQL file
    with open('scripts/init-supabase.sql', 'r') as f:
        sql_content = f.read()
    
    print(f"✓ Loaded SQL migration file ({len(sql_content)} bytes)\n")
    
    # Connect to database
    print("📊 Connecting to Supabase database...")
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    print("✓ Connected!\n")
    
    # Execute SQL
    print("⚙️  Executing SQL statements...\n")
    cursor.execute(sql_content)
    conn.commit()
    
    print("✅ Database migration completed successfully!\n")
    print("📋 Created tables:")
    print("  ✓ students")
    print("  ✓ school_settings")
    print("  ✓ attendance_sessions")
    print("  ✓ exam_events")
    print("  ✓ card_templates")
    print("  ✓ attendance_logs\n")
    print("🎉 Your Supabase database is ready to use!")
    
    cursor.close()
    conn.close()
    
except psycopg2.Error as e:
    print(f"❌ Database error: {e}")
    sys.exit(1)
except FileNotFoundError:
    print("❌ Error: scripts/init-supabase.sql file not found")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
