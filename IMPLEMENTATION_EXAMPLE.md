# Contoh Implementasi - Migrasi ke Supabase

Ini adalah contoh bagaimana mengupdate komponen dari localStorage ke Supabase.

## Sebelumnya (localStorage)

```tsx
'use client';
import { useState, useEffect } from 'react';
import { getDB, saveDB } from '@/app/lib/db';
import { Student } from '@/app/lib/types';

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load dari localStorage
    const db = getDB();
    setStudents(db.students);
    setLoading(false);
  }, []);

  const addStudent = (newStudent: Student) => {
    // Update localStorage
    const db = getDB();
    db.students.push(newStudent);
    saveDB(db);
    setStudents(db.students);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    // Update localStorage
    const db = getDB();
    const idx = db.students.findIndex(s => s.id === id);
    if (idx >= 0) {
      db.students[idx] = { ...db.students[idx], ...updates };
      saveDB(db);
      setStudents(db.students);
    }
  };

  const deleteStudent = (id: string) => {
    // Delete dari localStorage
    const db = getDB();
    db.students = db.students.filter(s => s.id !== id);
    saveDB(db);
    setStudents(db.students);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {students.map(student => (
        <div key={student.id} className="flex justify-between">
          <span>{student.name}</span>
          <button onClick={() => deleteStudent(student.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## Sesudahnya (Supabase + Hooks)

```tsx
'use client';
import { useStudents } from '@/hooks/use-supabase-data';

export function StudentList() {
  const { students, loading, error, updateStudent, deleteStudent } = useStudents();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      {students.map(student => (
        <div key={student.id} className="flex justify-between">
          <span>{student.name}</span>
          <button onClick={() => deleteStudent(student.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## Migrasi Langkah demi Langkah

### Step 1: Update Imports
```tsx
// Dari:
import { getDB, saveDB } from '@/app/lib/db';

// Ke:
import { useStudents } from '@/hooks/use-supabase-data';
```

### Step 2: Ganti useState + useEffect dengan Hook
```tsx
// Dari:
const [students, setStudents] = useState<Student[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const db = getDB();
  setStudents(db.students);
  setLoading(false);
}, []);

// Ke:
const { students, loading, error } = useStudents();
```

### Step 3: Ganti Manual Updates dengan Async Functions
```tsx
// Dari:
const addStudent = (newStudent: Student) => {
  const db = getDB();
  db.students.push(newStudent);
  saveDB(db);
  setStudents(db.students);
};

// Ke:
const { addStudent } = useStudents();
// Tinggal call: await addStudent(newStudent);
```

### Step 4: Handle Error & Loading
```tsx
// Dari:
if (loading) return <div>Loading...</div>;

// Ke:
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
```

## Contoh Lengkap: Admin Students Page

```tsx
'use client';
import { useState } from 'react';
import { useStudents } from '@/hooks/use-supabase-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export default function AdminStudentsPage() {
  const { students, loading, error, addStudent, updateStudent, deleteStudent } = useStudents();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    nis: '',
    nisn: '',
    name: '',
    class: '',
    major: '',
    school_year: '2024/2025'
  });

  const handleAdd = async () => {
    if (!formData.nis || !formData.name) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'NIS dan nama harus diisi'
      });
      return;
    }

    try {
      setIsAdding(true);
      await addStudent({
        ...formData,
        status: 'Aktif',
        valid_until: '2025-06-30',
        card_code: `CC-${Date.now()}`
      });
      toast({
        title: 'Sukses',
        description: 'Siswa berhasil ditambahkan'
      });
      setFormData({
        nis: '',
        nisn: '',
        name: '',
        class: '',
        major: '',
        school_year: '2024/2025'
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal menambahkan siswa'
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus siswa ini?')) return;
    try {
      await deleteStudent(id);
      toast({
        title: 'Sukses',
        description: 'Siswa berhasil dihapus'
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal menghapus siswa'
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Kelola Siswa</h1>

      {/* Form Add */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h2 className="text-lg font-semibold">Tambah Siswa Baru</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="NIS"
            value={formData.nis}
            onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
          />
          <Input
            placeholder="NISN"
            value={formData.nisn}
            onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
          />
          <Input
            placeholder="Nama Lengkap"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="col-span-2"
          />
          <Input
            placeholder="Kelas"
            value={formData.class}
            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
          />
          <Input
            placeholder="Jurusan"
            value={formData.major}
            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
          />
        </div>
        <Button onClick={handleAdd} disabled={isAdding} className="w-full">
          {isAdding ? 'Menambahkan...' : 'Tambah Siswa'}
        </Button>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">NIS</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Nama</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Kelas</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Jurusan</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 text-sm">{student.nis}</td>
                <td className="px-4 py-3 text-sm">{student.name}</td>
                <td className="px-4 py-3 text-sm">{student.class}</td>
                <td className="px-4 py-3 text-sm">{student.major}</td>
                <td className="px-4 py-3 text-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(student.id)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-slate-500">
        Total: {students.length} siswa
      </p>
    </div>
  );
}
```

## Tips & Tricks

### 1. Error Handling
```tsx
try {
  await addStudent(data);
} catch (error) {
  console.error('Failed to add:', error);
  toast({
    variant: 'destructive',
    title: 'Error',
    description: error instanceof Error ? error.message : 'Unknown error'
  });
}
```

### 2. Loading State
```tsx
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  setIsLoading(true);
  try {
    await someAsyncAction();
  } finally {
    setIsLoading(false);
  }
};

<Button disabled={isLoading}>
  {isLoading ? 'Processing...' : 'Submit'}
</Button>
```

### 3. Optimistic Updates
```tsx
const handleDelete = async (id: string) => {
  // Update UI immediately
  setStudents(students.filter(s => s.id !== id));
  
  try {
    // Do actual delete
    await deleteStudent(id);
  } catch (error) {
    // Revert if fails
    const { students: fresh } = await useStudents();
    setStudents(fresh);
    toast({ variant: 'destructive', title: 'Error' });
  }
};
```

## Komponen yang Perlu Diupdate

Berikut adalah file yang masih perlu diupdate untuk fully utilize Supabase:

1. `/src/app/page.tsx` - Main landing page
2. `/src/app/scanner/page.tsx` - Scanner page
3. `/src/app/admin/students/page.tsx` - Student management
4. `/src/app/admin/settings/page.tsx` - Settings page
5. `/src/app/admin/templates/page.tsx` - Template management
6. `/src/app/admin/exams/page.tsx` - Exam management
7. `/src/app/admin/attendance/page.tsx` - Attendance view
8. `/src/app/admin/cards/page.tsx` - Card generation
9. `/src/app/admin/exam-cards/page.tsx` - Exam cards
10. `/src/app/admin/id-cards/page.tsx` - ID cards
11. `/src/app/mode-selection/page.tsx` - Mode selection
12. `/src/app/verify/[code]/page.tsx` - Card verification

Total: 12 file untuk di-migrate

**PRIORITY**: Admin pages (students, settings, templates, exams) yang paling sering edit data.
