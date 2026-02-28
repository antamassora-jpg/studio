# Supabase Quick Reference

## 📋 Setup

```bash
# Setup is already done! Just visit:
# http://localhost:3000/setup

# Or run the SQL manually in Supabase Dashboard:
# Copy /scripts/init-supabase.sql and paste into SQL Editor
```

## 📊 Basic Operations

### Fetch Data
```typescript
import { 
  getStudents, 
  getSchoolSettings,
  getAttendanceLogs,
  getExamEvents,
  getAttendanceSessions,
  getCardTemplates 
} from '@/lib/supabase/db-operations';

const students = await getStudents();
const settings = await getSchoolSettings();
const logs = await getAttendanceLogs();
```

### Create Data
```typescript
import { addStudent, addAttendanceLog } from '@/lib/supabase/db-operations';

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
```

### Update Data
```typescript
import { updateStudent, updateSchoolSettings } from '@/lib/supabase/db-operations';

await updateStudent(studentId, {
  status: 'Lulus',
  valid_until: '2024-06-30'
});

await updateSchoolSettings({
  school_name: 'New School Name',
  student_show_photo_front: false,
});
```

### Delete Data
```typescript
import { deleteStudent } from '@/lib/supabase/db-operations';

await deleteStudent(studentId);
```

## 🔄 Real-time Updates

### Single Table Subscription
```typescript
import { useRealtime } from '@/lib/supabase/use-realtime';

function StudentList() {
  const [students, setStudents] = useState([]);

  useRealtime({
    table: 'students',
    event: 'INSERT', // 'INSERT' | 'UPDATE' | 'DELETE' | '*'
    onInsert: (newStudent) => {
      setStudents(prev => [...prev, newStudent]);
    },
  });

  // Component code...
}
```

### Multiple Table Subscriptions
```typescript
import { useRealtimeMultiple } from '@/lib/supabase/use-realtime';

function Dashboard() {
  useRealtimeMultiple([
    {
      table: 'students',
      event: '*',
      onInsert: handleNewStudent,
      onUpdate: handleStudentUpdate,
      onDelete: handleStudentDelete,
    },
    {
      table: 'attendance_logs',
      event: 'INSERT',
      onInsert: handleNewLog,
    },
    {
      table: 'school_settings',
      event: 'UPDATE',
      onUpdate: handleSettingsChange,
    },
  ]);

  // Component code...
}
```

### Filtered Subscriptions
```typescript
useRealtime({
  table: 'attendance_logs',
  event: 'INSERT',
  filter: `student_id=eq.${studentId}`, // PostgreSQL filter syntax
  onInsert: handleNewLog,
});
```

## 🎯 Common Patterns

### Load Data on Mount
```typescript
'use client';

import { useEffect, useState } from 'react';
import { getStudents } from '@/lib/supabase/db-operations';

export function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getStudents();
      setStudents(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* render students */}</div>;
}
```

### Real-time List with Add
```typescript
'use client';

import { useState, useEffect } from 'react';
import { getStudents, addStudent } from '@/lib/supabase/db-operations';
import { useRealtime } from '@/lib/supabase/use-realtime';

export function StudentManager() {
  const [students, setStudents] = useState([]);

  // Load initial data
  useEffect(() => {
    getStudents().then(setStudents);
  }, []);

  // Listen for new students
  useRealtime({
    table: 'students',
    event: 'INSERT',
    onInsert: (newStudent) => {
      setStudents(prev => [...prev, newStudent]);
    },
  });

  const handleAdd = async (name, nis) => {
    await addStudent({
      nis,
      name,
      class: 'XII',
      major: 'Teknik',
      school_year: '2024/2025',
      status: 'Aktif',
      valid_until: '2025-06-30',
      card_code: `CC-${nis}`,
    });
    // New student appears automatically via real-time!
  };

  return (
    <div>
      <button onClick={() => handleAdd('John', '2024001')}>Add Student</button>
      {students.map(s => <div key={s.id}>{s.name}</div>)}
    </div>
  );
}
```

### Monitoring Attendance in Real-time
```typescript
'use client';

import { useState } from 'react';
import { useRealtime } from '@/lib/supabase/use-realtime';

export function AttendanceMonitor() {
  const [logs, setLogs] = useState([]);

  useRealtime({
    table: 'attendance_logs',
    event: 'INSERT',
    onInsert: (newLog) => {
      setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50
      // Play sound or notification
      console.log('📍 Attendance: ', newLog.card_code, newLog.scanned_at);
    },
  });

  return (
    <div className="p-4">
      <h2>Recent Attendance</h2>
      {logs.map(log => (
        <div key={log.id} className="p-2 border-b">
          {log.card_code} - {log.scanned_at}
        </div>
      ))}
    </div>
  );
}
```

## 📱 TypeScript Types

All types are in `/src/app/lib/types.ts`:

```typescript
interface Student {
  id: string;
  nis: string;
  nisn?: string;
  name: string;
  class: string;
  major: string;
  school_year: string;
  photo_url?: string;
  status: 'Aktif' | 'Nonaktif' | 'Lulus' | 'Pindah';
  valid_until: string;
  card_code: string;
}

interface AttendanceLog {
  id: string;
  student_id: string;
  card_code: string;
  date: string;
  session_id: string;
  exam_id?: string;
  scanned_at: string;
  scanned_by_user_id: string;
  is_valid: boolean;
  reason?: string;
  device_info?: string;
  location?: string;
}
```

## 🔐 Security Notes

- Always use `NEXT_PUBLIC_SUPABASE_ANON_KEY` in browser
- Use `SUPABASE_SERVICE_ROLE_KEY` only on server (API routes, server actions)
- Real-time subscriptions are limited to public data by default
- Consider Row Level Security (RLS) for sensitive data
- Filter subscriptions to reduce bandwidth: `filter: 'user_id=eq.me'`

## 🚀 Performance Tips

1. **Limit subscriptions**: Don't subscribe to all tables, only what you need
2. **Use filters**: `filter: 'status=eq.Aktif'` to reduce data
3. **Unsubscribe properly**: `useRealtime` cleans up automatically
4. **Batch operations**: Insert 100 items at once vs. one by one
5. **Use indexes**: Already set up in `init-supabase.sql`

## 📍 Database Locations

```
Tables:     Supabase Dashboard → Table Editor
Logs:       Supabase Dashboard → Logs
SQL Editor: Supabase Dashboard → SQL Editor
Real-time:  Supabase Dashboard → Project Settings → Replication
```

## 🐛 Debugging

```typescript
// Enable detailed logging
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// Log queries
const { data, error } = await supabase
  .from('students')
  .select('*');

console.log('[DB] Query result:', data);
if (error) console.error('[DB] Query error:', error);

// Monitor real-time events
useRealtime({
  table: 'students',
  event: '*',
  onInsert: (data) => console.log('[RT] INSERT:', data),
  onUpdate: (data) => console.log('[RT] UPDATE:', data),
  onDelete: (data) => console.log('[RT] DELETE:', data),
});
```

## 📞 Help

- **Setup Issues**: Read `SUPABASE_SETUP.md`
- **Errors**: Check browser console (F12) and Supabase Logs
- **Real-time not working**: Enable replication in Supabase settings
- **Permission errors**: Check `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

Happy coding! 🎉
