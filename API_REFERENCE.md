# Supabase Database API Reference

Complete reference for all database operations and real-time hooks.

---

## 🔌 Import Statements

```typescript
// Database operations
import {
  // Students
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  
  // School Settings
  getSchoolSettings,
  updateSchoolSettings,
  
  // Attendance Sessions
  getAttendanceSessions,
  addAttendanceSession,
  updateAttendanceSession,
  
  // Exam Events
  getExamEvents,
  addExamEvent,
  
  // Attendance Logs
  getAttendanceLogs,
  addAttendanceLog,
  
  // Card Templates
  getCardTemplates,
  updateCardTemplate,
} from '@/lib/supabase/db-operations';

// Real-time hooks
import {
  useRealtime,
  useRealtimeMultiple,
} from '@/lib/supabase/use-realtime';

// Data migration
import {
  migrateLocalStorageToSupabase,
  isMigrationComplete,
} from '@/lib/supabase/migrate-data';
```

---

## 📚 Complete API Reference

### STUDENTS

#### `getStudents(): Promise<Student[]>`
Fetch all students from database.

```typescript
const students = await getStudents();
// Returns array of Student objects sorted by name
```

**Returns**: `Student[]`

---

#### `getStudentById(id: string): Promise<Student | null>`
Fetch a specific student by ID.

```typescript
const student = await getStudentById('student-uuid');
// Returns Student or null if not found
```

**Parameters**:
- `id`: Student UUID

**Returns**: `Student | null`

---

#### `addStudent(student: Omit<Student, 'id'>): Promise<Student | null>`
Add a new student to database.

```typescript
const newStudent = await addStudent({
  nis: '2024001',
  nisn: '0051234567',
  name: 'John Doe',
  class: 'XII',
  major: 'Teknik Komputer & Jaringan',
  school_year: '2024/2025',
  photo_url: 'https://...',
  status: 'Aktif',
  valid_until: '2025-06-30',
  card_code: 'CC-TKJ-001',
});
```

**Parameters**:
- `student`: Student data (without ID)

**Returns**: `Student | null` (newly created student with ID)

---

#### `updateStudent(id: string, updates: Partial<Student>): Promise<Student | null>`
Update student data.

```typescript
await updateStudent('student-uuid', {
  status: 'Lulus',
  valid_until: '2024-06-30',
  photo_url: 'https://new-photo.jpg',
});
```

**Parameters**:
- `id`: Student UUID
- `updates`: Partial student object (only fields to update)

**Returns**: `Student | null` (updated student)

---

#### `deleteStudent(id: string): Promise<boolean>`
Delete a student from database.

```typescript
const success = await deleteStudent('student-uuid');
```

**Parameters**:
- `id`: Student UUID

**Returns**: `boolean` (success)

---

### SCHOOL SETTINGS

#### `getSchoolSettings(): Promise<SchoolSettings | null>`
Fetch school configuration settings.

```typescript
const settings = await getSchoolSettings();
```

**Returns**: `SchoolSettings | null`

---

#### `updateSchoolSettings(settings: Partial<SchoolSettings>): Promise<SchoolSettings | null>`
Update school settings (creates if not exists).

```typescript
await updateSchoolSettings({
  school_name: 'SMKN 2 Tana Toraja',
  principal_name: 'Drs. John Doe, M.Pd.',
  principal_nip: '19700101 199501 1 001',
  student_show_photo_front: true,
  student_show_qr_back: true,
  exam_show_stamp_front: false,
  id_show_logo_front: true,
});
```

**Parameters**:
- `settings`: Partial SchoolSettings object

**Returns**: `SchoolSettings | null`

---

### ATTENDANCE SESSIONS

#### `getAttendanceSessions(): Promise<AttendanceSession[]>`
Fetch all attendance sessions.

```typescript
const sessions = await getAttendanceSessions();
// Returns: [
//   { id: 'uuid', name: 'Masuk', start_time: '07:00', late_after: '07:30' },
//   { id: 'uuid', name: 'Pulang', start_time: '15:00', late_after: null }
// ]
```

**Returns**: `AttendanceSession[]`

---

#### `addAttendanceSession(session: Omit<AttendanceSession, 'id'>): Promise<AttendanceSession | null>`
Add a new attendance session.

```typescript
await addAttendanceSession({
  name: 'Masuk',
  start_time: '07:00',
  late_after: '07:30',
});
```

**Parameters**:
- `session`: Session data (without ID)

**Returns**: `AttendanceSession | null`

---

#### `updateAttendanceSession(id: string, updates: Partial<AttendanceSession>): Promise<AttendanceSession | null>`
Update a session.

```typescript
await updateAttendanceSession('session-uuid', {
  late_after: '07:45',
});
```

**Parameters**:
- `id`: Session UUID
- `updates`: Partial session object

**Returns**: `AttendanceSession | null`

---

### EXAM EVENTS

#### `getExamEvents(): Promise<ExamEvent[]>`
Fetch all exam events.

```typescript
const exams = await getExamEvents();
// Returns events sorted by start_date descending
```

**Returns**: `ExamEvent[]`

---

#### `addExamEvent(exam: Omit<ExamEvent, 'id'>): Promise<ExamEvent | null>`
Add a new exam event.

```typescript
await addExamEvent({
  name: 'Ujian Tengah Semester Ganjil',
  school_year: '2024/2025',
  semester: 'Ganjil',
  start_date: '2024-10-01',
  end_date: '2024-10-10',
  notes: 'Ujian tertulis dan praktik',
});
```

**Parameters**:
- `exam`: Exam event data

**Returns**: `ExamEvent | null`

---

### ATTENDANCE LOGS

#### `getAttendanceLogs(): Promise<AttendanceLog[]>`
Fetch all attendance logs.

```typescript
const logs = await getAttendanceLogs();
// Returns logs sorted by scanned_at descending
```

**Returns**: `AttendanceLog[]`

---

#### `addAttendanceLog(log: Omit<AttendanceLog, 'id'>): Promise<AttendanceLog | null>`
Log an attendance scan.

```typescript
await addAttendanceLog({
  student_id: 'student-uuid',
  card_code: 'CC-TKJ-001',
  date: '2024-10-15',
  session_id: 'session-uuid',
  scanned_at: new Date().toISOString(),
  scanned_by_user_id: 'user-uuid',
  is_valid: true,
  location: 'Ruang Scan Utama',
});
```

**Parameters**:
- `log`: Attendance log data

**Returns**: `AttendanceLog | null`

---

### CARD TEMPLATES

#### `getCardTemplates(): Promise<CardTemplate[]>`
Fetch all card templates.

```typescript
const templates = await getCardTemplates();
```

**Returns**: `CardTemplate[]`

---

#### `updateCardTemplate(id: string, updates: Partial<CardTemplate>): Promise<CardTemplate | null>`
Update a card template.

```typescript
await updateCardTemplate('template-uuid', {
  name: 'Updated Template Name',
  is_active: true,
  preview_color: '#FF5733',
});
```

**Parameters**:
- `id`: Template UUID
- `updates`: Partial template object

**Returns**: `CardTemplate | null`

---

## 🔄 Real-time Hooks

### `useRealtime(options: UseRealtimeOptions)`
Subscribe to a single table's changes.

```typescript
interface UseRealtimeOptions {
  table: 'students' | 'school_settings' | 'attendance_sessions' | 
         'exam_events' | 'card_templates' | 'attendance_logs';
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  filter?: string;  // PostgreSQL filter syntax
}
```

**Example**:
```typescript
function StudentMonitor() {
  const [newStudents, setNewStudents] = useState([]);

  useRealtime({
    table: 'students',
    event: 'INSERT',
    onInsert: (student) => {
      setNewStudents(prev => [...prev, student]);
    },
  });

  return <div>{newStudents.length} new students</div>;
}
```

---

### `useRealtimeMultiple(options: UseRealtimeOptions[])`
Subscribe to multiple tables simultaneously.

```typescript
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

  return <div>Real-time Dashboard</div>;
}
```

---

## 🔀 Data Migration

### `migrateLocalStorageToSupabase(): Promise<boolean>`
Migrate all localStorage data to Supabase.

```typescript
const success = await migrateLocalStorageToSupabase();
if (success) {
  console.log('Migration complete!');
}
```

**Returns**: `boolean` (success)

**Note**: Automatically sets flag on completion

---

### `isMigrationComplete(): boolean`
Check if migration has been completed.

```typescript
if (isMigrationComplete()) {
  console.log('Already migrated to Supabase');
} else {
  console.log('Still using localStorage');
}
```

**Returns**: `boolean`

---

## 📊 Data Types

### Student
```typescript
interface Student {
  id: string;
  nis: string;                    // Nomor Induk Siswa
  nisn?: string;                  // Nomor Induk Siswa Nasional
  name: string;
  class: string;                  // e.g., 'XII'
  major: string;                  // e.g., 'Teknik Komputer'
  school_year: string;            // e.g., '2024/2025'
  photo_url?: string;
  status: 'Aktif' | 'Nonaktif' | 'Lulus' | 'Pindah';
  valid_until: string;            // Date format: YYYY-MM-DD
  card_code: string;              // Unique card identifier
}
```

### AttendanceLog
```typescript
interface AttendanceLog {
  id: string;
  student_id: string;
  card_code: string;
  date: string;                   // YYYY-MM-DD
  session_id: string;
  exam_id?: string;
  scanned_at: string;             // ISO 8601 timestamp
  scanned_by_user_id: string;
  is_valid: boolean;
  reason?: string;
  device_info?: string;
  location?: string;
}
```

### AttendanceSession
```typescript
interface AttendanceSession {
  id: string;
  name: string;                   // e.g., 'Masuk', 'Pulang'
  start_time?: string;            // HH:MM format
  late_after?: string;            // HH:MM format
}
```

### ExamEvent
```typescript
interface ExamEvent {
  id: string;
  name: string;
  school_year: string;
  semester: string;               // 'Ganjil' or 'Genap'
  start_date: string;             // YYYY-MM-DD
  end_date: string;               // YYYY-MM-DD
  notes?: string;
}
```

---

## 🎯 Common Patterns

### Load and Subscribe
```typescript
const [data, setData] = useState([]);

useEffect(() => {
  getStudents().then(setData);
}, []);

useRealtime({
  table: 'students',
  onInsert: (newItem) => {
    setData(prev => [...prev, newItem]);
  },
  onUpdate: (updated) => {
    setData(prev => prev.map(item => 
      item.id === updated.id ? updated : item
    ));
  },
  onDelete: (deleted) => {
    setData(prev => prev.filter(item => item.id !== deleted.id));
  },
});
```

### Filtered Subscription
```typescript
useRealtime({
  table: 'attendance_logs',
  event: 'INSERT',
  filter: `date=eq.2024-10-15`, // PostgreSQL filter syntax
  onInsert: handleNewLog,
});
```

### Error Handling
```typescript
try {
  const student = await addStudent({
    nis: '2024001',
    name: 'John Doe',
    // ... other fields
  });
  
  if (!student) {
    console.error('Failed to add student');
    return;
  }
  
  console.log('Student added:', student.id);
} catch (error) {
  console.error('Error:', error);
}
```

---

## 🔐 Filter Syntax (PostgreSQL)

```typescript
// Equality
filter: `status=eq.Aktif`

// Comparison
filter: `valid_until=gt.2024-06-30`    // greater than
filter: `valid_until=lt.2024-06-30`    // less than
filter: `valid_until=gte.2024-06-30`   // greater than or equal
filter: `valid_until=lte.2024-06-30`   // less than or equal
filter: `valid_until=neq.2024-06-30`   // not equal

// Text
filter: `name=ilike.%john%`            // case-insensitive like
filter: `name=like.John%`              // case-sensitive like

// Combination
filter: `status=eq.Aktif&class=eq.XII` // AND condition
```

---

## 📈 Best Practices

1. **Always handle null returns** - Database operations can fail
2. **Clean up subscriptions** - Hooks do this automatically
3. **Use filters** - Reduce data transferred for large datasets
4. **Batch operations** - Insert multiple records together
5. **Error logging** - Log errors to console for debugging

---

## 🚀 Performance Tips

```typescript
// ❌ Bad: Multiple separate subscriptions
useRealtime({ table: 'students', ... });
useRealtime({ table: 'attendance_logs', ... });
useRealtime({ table: 'school_settings', ... });

// ✅ Good: Single multi-subscription
useRealtimeMultiple([
  { table: 'students', ... },
  { table: 'attendance_logs', ... },
  { table: 'school_settings', ... },
]);
```

---

For more examples, see `SUPABASE_QUICK_REFERENCE.md`
