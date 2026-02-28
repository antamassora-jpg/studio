# Supabase Setup Guide

This guide will help you set up the complete Supabase database integration for the Education Card Management System.

## Prerequisites

- Supabase project already created and connected (env vars are set)
- All required environment variables are configured in your project

## Step 1: Create Database Tables

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Navigate to the **SQL Editor**
3. Click **New Query**
4. Copy the entire contents from `/scripts/init-supabase.sql`
5. Paste it into the SQL editor
6. Click **Run**

This will create all 6 tables with proper relationships and enable real-time functionality.

### Option B: Using Your Application

The app includes a setup page at `/setup`:

1. Visit `http://localhost:3000/setup` in your browser
2. Click **Start Migration**
3. The system will:
   - Create all database tables
   - Migrate any existing localStorage data to Supabase
   - Enable real-time subscriptions

## Database Schema

### Tables Created

1. **students** - Student information and card data
2. **school_settings** - School configuration and card display settings
3. **attendance_sessions** - Attendance session definitions (Masuk, Pulang, etc.)
4. **exam_events** - Exam period information
5. **card_templates** - Card design templates and configurations
6. **attendance_logs** - Attendance scan records with real-time tracking

### Real-time Features

All tables are set up for **Postgres real-time** subscriptions. This means:

- Changes are instantly reflected across all connected clients
- New attendance logs appear immediately
- Settings updates sync in real-time
- New students are visible to all users without refresh

## Usage in Your App

### Fetching Data

```typescript
import { getStudents, getSchoolSettings, getAttendanceLogs } from '@/lib/supabase/db-operations';

// Get all students
const students = await getStudents();

// Get school settings
const settings = await getSchoolSettings();

// Get attendance logs
const logs = await getAttendanceLogs();
```

### Adding/Updating Data

```typescript
import { 
  addStudent, 
  updateStudent, 
  addAttendanceLog 
} from '@/lib/supabase/db-operations';

// Add a new student
const newStudent = await addStudent({
  nis: '2024001',
  nisn: '0051234567',
  name: 'John Doe',
  class: 'XII',
  major: 'Teknik Komputer',
  school_year: '2024/2025',
  status: 'Aktif',
  valid_until: '2025-06-30',
  card_code: 'CC-TKJ-001',
});

// Update a student
await updateStudent(studentId, {
  status: 'Lulus',
  valid_until: '2024-06-30'
});

// Log attendance
await addAttendanceLog({
  student_id: studentId,
  card_code: 'CC-TKJ-001',
  date: new Date().toISOString().split('T')[0],
  session_id: sessionId,
  scanned_at: new Date().toISOString(),
  is_valid: true,
});
```

### Real-time Subscriptions

Use the `useRealtime` hook to listen for changes:

```typescript
import { useRealtime } from '@/lib/supabase/use-realtime';
import { useState } from 'react';

export function AttendanceMonitor() {
  const [logs, setLogs] = useState([]);

  useRealtime({
    table: 'attendance_logs',
    event: 'INSERT',
    onInsert: (newLog) => {
      // New attendance log added in real-time
      setLogs(prev => [newLog, ...prev]);
      console.log('New attendance:', newLog);
    },
  });

  return (
    // Your component using logs
  );
}
```

For multiple tables:

```typescript
import { useRealtimeMultiple } from '@/lib/supabase/use-realtime';

export function Dashboard() {
  useRealtimeMultiple([
    {
      table: 'attendance_logs',
      event: 'INSERT',
      onInsert: handleNewLog,
    },
    {
      table: 'students',
      event: '*',
      onInsert: handleNewStudent,
      onUpdate: handleStudentUpdate,
      onDelete: handleStudentDelete,
    },
    {
      table: 'school_settings',
      event: 'UPDATE',
      onUpdate: handleSettingsUpdate,
    },
  ]);

  return (
    // Your dashboard
  );
}
```

## Data Migration

If you have existing data in localStorage:

1. Visit `/setup` page
2. Click "Start Migration"
3. All localStorage data will be migrated to Supabase
4. The app will automatically use Supabase from that point forward

Migration is idempotent - you can run it multiple times safely.

## Environment Variables

These should already be set up, but verify they exist:

```
NEXT_PUBLIC_SUPABASE_URL=your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Troubleshooting

### Tables don't exist
- Go to Supabase Dashboard → SQL Editor
- Run the `init-supabase.sql` script
- Or visit `/setup` page and click "Start Migration"

### Real-time updates not working
- Check that real-time is enabled in Supabase project settings
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check browser console for connection errors

### Migration errors
- Ensure all environment variables are correctly set
- Check that you have proper permissions in Supabase
- Try clearing `localStorage` and running migration again
- Check browser console for specific error messages

### Performance issues
- Create indexes (done automatically in the SQL script)
- Limit real-time subscriptions to necessary tables only
- Use filtering in subscriptions when possible

## Advanced Features

### Filtering Real-time Updates

Only listen to new attendance logs for a specific student:

```typescript
useRealtime({
  table: 'attendance_logs',
  event: 'INSERT',
  filter: `student_id=eq.${studentId}`,
  onInsert: handleNewLog,
});
```

### Listening to Specific Event Types

```typescript
// Only listen to updates, not inserts or deletes
useRealtime({
  table: 'students',
  event: 'UPDATE',
  onUpdate: handleStudentUpdate,
});
```

## Next Steps

1. Complete the setup at `/setup`
2. Verify data appears in Supabase Dashboard → Table Editor
3. Test real-time by opening the app in two windows
4. Make changes in one window - see them instantly in the other
5. Check console logs to monitor real-time events

---

For more information, visit the [Supabase Documentation](https://supabase.com/docs)
