# Quick Update Examples - Copy & Paste

Gunakan contoh ini untuk cepat mengupdate halaman lainnya ke Supabase.

## Pattern 1: Simple List + CRUD (untuk attendance, exams)

### BEFORE (localStorage)
```tsx
"use client";
import { useState, useEffect } from 'react';
import { getDB, saveDB } from '@/app/lib/db';
import { ExamEvent } from '@/app/lib/types';

export default function ExamsPage() {
  const [exams, setExams] = useState<ExamEvent[]>([]);

  useEffect(() => {
    setExams(getDB().exams);
  }, []);

  const handleAdd = (newExam: Omit<ExamEvent, 'id'>) => {
    const db = getDB();
    const exam: ExamEvent = { ...newExam, id: 'e' + Date.now() };
    db.exams.push(exam);
    saveDB(db);
    setExams([...db.exams]);
  };

  const handleDelete = (id: string) => {
    const db = getDB();
    db.exams = db.exams.filter(e => e.id !== id);
    saveDB(db);
    setExams(db.exams);
  };

  return (
    <div>
      {exams.map(exam => (
        <div key={exam.id}>
          <h3>{exam.name}</h3>
          <button onClick={() => handleDelete(exam.id)}>Hapus</button>
        </div>
      ))}
    </div>
  );
}
```

### AFTER (Supabase)
```tsx
"use client";
import { useState, useEffect } from 'react';
import { getExams, addExam, updateExam, deleteExam } from '@/app/lib/db';
import { ExamEvent } from '@/app/lib/types';
import { toast } from '@/hooks/use-toast';

export default function ExamsPage() {
  const [exams, setExams] = useState<ExamEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExams = async () => {
      try {
        const data = await getExams();
        setExams(data);
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Gagal load exams" });
      } finally {
        setLoading(false);
      }
    };
    loadExams();
  }, []);

  const handleAdd = async (newExam: Omit<ExamEvent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const exam = await addExam(newExam);
      setExams([...exams, exam]);
      toast({ title: "Berhasil", description: "Ujian ditambahkan" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Gagal tambah ujian" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExam(id);
      setExams(exams.filter(e => e.id !== id));
      toast({ title: "Berhasil", description: "Ujian dihapus" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Gagal hapus ujian" });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {exams.map(exam => (
        <div key={exam.id}>
          <h3>{exam.name}</h3>
          <button onClick={() => handleDelete(exam.id)}>Hapus</button>
        </div>
      ))}
    </div>
  );
}
```

## Pattern 2: Using Custom Hooks (Recommended)

### AFTER (dengan Custom Hooks - Super Clean!)
```tsx
"use client";
import { useState } from 'react';
import { useExamsData } from '@/hooks/use-supabase';
import { addExam, deleteExam } from '@/app/lib/db';
import { ExamEvent } from '@/app/lib/types';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ExamsPage() {
  const { data: exams, loading, refetch } = useExamsData();

  const handleAdd = async (newExam: Omit<ExamEvent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await addExam(newExam);
      refetch();
      toast({ title: "Berhasil", description: "Ujian ditambahkan" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Gagal tambah ujian" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExam(id);
      refetch();
      toast({ title: "Berhasil", description: "Ujian dihapus" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Gagal hapus ujian" });
    }
  };

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <div>
      {exams.map(exam => (
        <div key={exam.id}>
          <h3>{exam.name}</h3>
          <button onClick={() => handleDelete(exam.id)}>Hapus</button>
        </div>
      ))}
    </div>
  );
}
```

## Key Differences Summary

| Aspect | localStorage | Supabase |
|--------|--------------|----------|
| **Data Scope** | Per-device | Cloud (shared) |
| **Sync** | Manual | Automatic (call refetch) |
| **Persistence** | Session only | Permanent |
| **Multi-device** | ❌ No | ✅ Yes |
| **Offline** | ✅ Yes | ❌ No |

## Function Reference

### Import Statements
```tsx
import { 
  getStudents,      // GET /api/students
  addStudent,       // POST /api/students
  updateStudent,    // PUT /api/students
  deleteStudent,    // DELETE /api/students
  
  getSettings,      // GET /api/settings
  updateSettings,   // POST /api/settings
  
  getTemplates,     // GET /api/templates
  addTemplate,      // POST /api/templates
  updateTemplate,   // PUT /api/templates
  deleteTemplate,   // (tidak ada endpoint)
  
  getExams,         // GET /api/exams
  addExam,          // POST /api/exams
  updateExam,       // PUT /api/exams
  deleteExam,       // (tidak ada endpoint)
  
  getAttendanceLogs, // GET /api/attendance-logs
  addAttendanceLog   // POST /api/attendance-logs
} from '@/app/lib/db';
```

### Function Signatures
```tsx
// STUDENTS
const students: Student[] = await getStudents();
const student: Student = await addStudent({
  name: string;
  nis: string;
  class: string;
  // ... dll
});
const updated: Student = await updateStudent(id, { name: string });
await deleteStudent(id);

// SETTINGS
const settings: SchoolSettings = await getSettings();
const updated: SchoolSettings = await updateSettings({
  school_name?: string;
  principal_name?: string;
  // ... dll
});

// EXAMS
const exams: ExamEvent[] = await getExams();
const exam: ExamEvent = await addExam({
  name: string;
  school_year: string;
  semester: string;
  start_date: Date;
  end_date: Date;
});
const updated: ExamEvent = await updateExam(id, { name?: string });

// LOGS
const logs: AttendanceLog[] = await getAttendanceLogs();
const logs = await getAttendanceLogs(studentId); // Filter by student
const logs = await getAttendanceLogs(undefined, cardCode); // Filter by card code
const log: AttendanceLog = await addAttendanceLog({
  student_id: string;
  card_code: string;
  date: Date;
  session_id: string;
  // ... dll
});
```

## Error Handling Pattern

```tsx
try {
  const data = await getStudents();
  setStudents(data);
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error('Error loading students:', error);
  toast({ 
    variant: "destructive", 
    title: "Gagal Memuat Data", 
    description: message 
  });
}
```

## Testing Pattern

```tsx
// Test data sync across devices:
// 1. Device A: Add data via /admin/students
// 2. Device B: Refresh /admin/students
// 3. New data should appear immediately ✅

// If not appearing:
// - Check browser console (F12) for errors
// - Check Network tab for API response
// - Verify Supabase dashboard has the data
```

## Notes

- Semua function bersifat **async**, gunakan `await` atau `.then()`
- Error handling sangat penting untuk UX yang baik
- Toast notifications membantu user tahu status operasi
- Custom hooks di `/src/hooks/use-supabase.ts` bisa langsung dipakai
- deleteTemplate dan deleteExam belum ada endpoint-nya (bisa ditambah kalau perlu)

Good luck dengan migrasi! Jika ada pertanyaan, lihat SUPABASE_MIGRATION_GUIDE.md 📚
